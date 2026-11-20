// Toonflow supplies the types from @toonflow/providers/types and all runtime tools.
type BreezeContext = ProviderContext<{ baseUrl: string }>;
type BreezePrompt = Record<string, { class_type: string; inputs: Record<string, unknown> }>;
type BreezeTask = {
  kind: string; requestId: string; taskId: string; baseHash: string;
  format: "wav" | "mp3"; sampleRate: number;
};
type BreezeSpeaker = { name: string; referenceText: string; emotion: string; cfgScale: number };

function fail(message: string): never {
  throw Object.assign(new Error(message), { code: "MEDIA_TASK_FAILED" });
}

function baseUrl(context: BreezeContext) {
  const url = new URL(context.config.baseUrl);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error("ComfyUI 地址须为不含凭据、查询参数和片段的 HTTP(S) 地址");
  }
  return url.href.replace(/\/+$/, "");
}

async function json(context: BreezeContext, base: string, path: string, signal: AbortSignal, body?: unknown): Promise<any> {
  const response = await context.tool.fetch(base + path, {
    signal,
    ...(body === undefined ? {} : {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    const message = `ComfyUI ${path}：${JSON.stringify(data).slice(0, 1600)}`;
    if (path === "/prompt" && response.status < 500) fail(message);
    throw new Error(message);
  }
  return data;
}

function pause(signal: AbortSignal) {
  signal.throwIfAborted();
  return new Promise<void>((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 1000);
    signal.addEventListener("abort", abort, { once: true });
  });
}

function numeric(value: unknown, fallback: number, min: number, max: number, title: string, integer = false) {
  const number = value === undefined ? fallback : Number(value);
  if (!Number.isFinite(number) || number < min || number > max || (integer && !Number.isInteger(number))) {
    fail(`${title}须在 ${min}–${max} 之间${integer ? "，并使用整数" : ""}`);
  }
  return number;
}

function text(value: unknown, title: string, required = true) {
  if (value !== undefined && typeof value !== "string") fail(`${title}须为文本`);
  const result = (value as string | undefined)?.trim() ?? "";
  if ((required && !result) || result.length > 20000) fail(`${title}不能为空，且不能超过 20000 字符`);
  return result;
}

function speakerKey(value: string) { return value.trim().replace(/\s+/gu, " ").toLowerCase(); }

function cast(other: Record<string, unknown>, audios: AudioRequest["audios"]): BreezeSpeaker[] {
  const size = numeric(other.castSize, 2, 1, 8, "角色数量", true);
  if (audios?.length !== size) fail(`已设置 ${size} 位角色，请按角色顺序连接恰好 ${size} 条固定参考音频（只计音频）`);
  const speakers: BreezeSpeaker[] = [];
  for (let index = 1; index <= size; index++) {
    const prefix = `speaker${index}`;
    const name = text(other[`${prefix}Name`], `角色 ${index} 名字`);
    if (name.length > 64 || /[\r\n:]/u.test(name)) fail(`角色 ${index} 名字不能超过 64 字，且不能含换行或英文冒号`);
    if (speakers.some(item => speakerKey(item.name) === speakerKey(name))) fail(`角色名重复：${name}`);
    const emotion = text(other[`${prefix}Emotion`], `${name} 情绪`, false);
    speakers.push({
      name,
      referenceText: text(other[`${prefix}ReferenceText`] ?? audios[index - 1].text, `${name} 参考音频的准确转写`),
      emotion,
      cfgScale: emotion ? numeric(other[`${prefix}CfgScale`], 4, 0.1, 10, `${name} 指令指导强度`) : 1,
    });
  }
  return speakers;
}

function script(source: string, speakers: BreezeSpeaker[]) {
  let turns: { speaker: string; text: string }[];
  if (/^[\[{]/u.test(source) && !/^\[[^\]]+\]\s*:/u.test(source)) {
    let value: unknown;
    try { value = JSON.parse(source); }
    catch { return fail("对话 JSON 无法解析，请使用 speaker/text 数组，或每行写“角色名: 台词”"); }
    if (!Array.isArray(value) || !value.length) fail("对话 JSON 须为非空的 speaker/text 数组");
    turns = value.map((turn, index) => {
      if (!turn || typeof turn !== "object" || Array.isArray(turn)) fail(`第 ${index + 1} 轮须为 speaker/text 对象`);
      if (Object.keys(turn).some(key => key !== "speaker" && key !== "text")) {
        fail(`第 ${index + 1} 轮只支持 speaker/text；情绪请在对应角色的参数中填写`);
      }
      return { speaker: text(turn.speaker, `第 ${index + 1} 轮角色`), text: text(turn.text, `第 ${index + 1} 轮台词`) };
    });
  } else {
    turns = [];
    for (const line of source.split(/\r?\n/u).map(item => item.trim()).filter(Boolean)) {
      const match = /^(?:\[([^\]]+)\]|([^:]+)):\s*(.*)$/u.exec(line);
      if (match) turns.push({ speaker: (match[1] ?? match[2]).trim(), text: match[3].trim() });
      else if (turns.length) turns[turns.length - 1].text += " " + line;
      else fail("对话须以“角色名: 台词”开头，使用英文冒号；也可粘贴 speaker/text JSON 数组");
    }
    if (!turns.length || turns.some(turn => !turn.text)) fail("每轮对话须包含角色名和非空台词");
  }
  return JSON.stringify(turns.map(turn => {
    const speaker = speakers.find(item => speakerKey(item.name) === speakerKey(turn.speaker));
    if (!speaker) fail(`脚本角色“${turn.speaker}”没有对应参考，已配置：${speakers.map(item => item.name).join("、")}`);
    return { speaker: speaker.name, text: turn.text };
  }));
}

async function upload(context: BreezeContext, base: string, audio: MediaInput, requestId: string, index: number, signal: AbortSignal) {
  const maxBytes = 20 * 1024 * 1024;
  let bytes: Uint8Array;
  let mimeType = audio.mimeType ?? "audio/wav";
  if (audio.type === "binary") bytes = audio.data;
  else if (audio.type === "base64") bytes = Buffer.from(audio.data.replace(/^data:[^;]+;base64,/u, ""), "base64");
  else {
    const url = new URL(audio.url);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) fail("参考音频地址无效");
    const response = await context.tool.fetch(url.href, { signal });
    if (!response.ok) throw new Error(`参考 ${index} 读取失败：HTTP ${response.status}`);
    if (Number(response.headers.get("content-length")) > maxBytes) fail(`参考 ${index} 超过 20 MiB`);
    bytes = new Uint8Array(await response.arrayBuffer());
    mimeType = audio.mimeType ?? response.headers.get("content-type") ?? mimeType;
  }
  if (!bytes.length || bytes.length > maxBytes) fail(`参考 ${index} 为空或超过 20 MiB`);
  mimeType = mimeType.split(";")[0].trim();
  const extension = ({ "audio/wav": "wav", "audio/x-wav": "wav", "audio/mpeg": "mp3", "audio/flac": "flac", "audio/ogg": "ogg", "audio/mp4": "m4a", "audio/webm": "webm" } as Record<string, string>)[mimeType];
  if (!extension) fail(`不支持参考 ${index} 的音频类型：${mimeType}`);
  const boundary = "Breeze" + requestId + index;
  const folder = "Toonflow/BreezeTTS2/" + requestId;
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="type"\r\n\r\ninput\r\n--${boundary}\r\nContent-Disposition: form-data; name="subfolder"\r\n\r\n${folder}\r\n--${boundary}\r\nContent-Disposition: form-data; name="overwrite"\r\n\r\nfalse\r\n--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="reference-${index}.${extension}"\r\nContent-Type: ${mimeType}\r\n\r\n`),
    bytes, Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);
  const response = await context.tool.fetch(base + "/upload/image", {
    method: "POST", signal, headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` }, body,
  });
  if (!response.ok) throw new Error(`参考 ${index} 上传失败：HTTP ${response.status}`);
  const result = await response.json() as { type: string; subfolder?: string; name: string };
  if (result.type !== "input" || !result.name) throw new Error(`参考 ${index} 上传结果无效`);
  return [result.subfolder, result.name].filter(Boolean).join("/");
}

async function poll(context: BreezeContext, base: string, task: BreezeTask, signal: AbortSignal): Promise<MediaAsset[]> {
  let absent = 0;
  while (true) {
    signal.throwIfAborted();
    const history = await json(context, base, "/history/" + encodeURIComponent(task.taskId), signal);
    const entry = history[task.taskId];
    if (entry) {
      const errors = (entry.status?.messages ?? []).filter((item: any[]) => ["execution_error", "execution_interrupted"].includes(item[0]));
      if (errors.length) fail(errors.map((item: any[]) => item[1]?.exception_message ?? item[0]).join("；"));
      if (entry.status?.status_str === "error") fail("ComfyUI 原任务执行失败，请查看任务历史");
      if (entry.status?.completed) {
        const file = entry.outputs?.["3"]?.audio?.find((item: any) => item.type === "output" && /\.wav$/iu.test(item.filename));
        if (!file) fail("ComfyUI 任务完成，但保存节点没有返回 WAV");
        const query = new URLSearchParams({ filename: file.filename, subfolder: file.subfolder ?? "", type: "output" });
        const response = await context.tool.fetch(base + "/view?" + query, { signal });
        if (!response.ok) throw new Error(`生成音频读取失败：HTTP ${response.status}`);
        const converted = await context.tool.audio.convert(new Uint8Array(await response.arrayBuffer()), { format: task.format, sampleRate: task.sampleRate });
        return [{ mediaType: "audio", type: "binary", data: converted.data, mimeType: converted.mimeType }];
      }
    } else {
      const queue = await json(context, base, "/queue", signal);
      const found = [...queue.queue_running, ...queue.queue_pending].some((item: any[]) => item[1] === task.taskId);
      absent = found ? 0 : absent + 1;
      if (absent >= 4) fail(`原任务 ${task.taskId} 已不在队列或历史中，未重复提交`);
    }
    await pause(signal);
  }
}

export default {
  id: "comfyBreezeTts2",
  label: "本地 ComfyUI · Breeze TTS 2",
  version: "2.0.1",
  readme: "先选择“角色音色设计与试听”，分别生成并试听角色声音；选定输出后固定使用这份音频。多轮对话选择“多角色固定参考对话”，按角色顺序连接 1–8 条音频，设置角色名、参考的完整转写和各自情绪。情绪留空时沿用参考，填写后使用该角色独立的表演指令。角色参数作用于该角色的全部轮次；台词支持“角色名: 台词”或 speaker/text JSON 数组。中文声音事件：[笑]、[咳嗽]、[清嗓子]、[叹气]。支持 WAV/MP3，任务恢复只查询原任务。停止 Toonflow 等待后，ComfyUI 原任务可能继续运行。",
  rules: [{ type: "el-input", field: "baseUrl", title: "ComfyUI 地址", value: "http://127.0.0.1:8189" }],
  models: [
  {
    "id": "breeze-tts-2-design",
    "label": "Breeze TTS 2 · 角色音色设计与试听",
    "type": "audio",
    "mode": [
      "text"
    ],
    "rules": [
      {
        "type": "el-input",
        "field": "instruction",
        "title": "角色音色描述",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 4,
          "placeholder": "描述年龄感、音域、音色和说话方式；中文台词配中文描述"
        }
      },
      {
        "type": "el-input-number",
        "field": "cfgScale",
        "title": "指令指导强度 CFG",
        "value": 4,
        "props": {
          "min": 0.1,
          "max": 10,
          "step": 0.1
        }
      },
      {
        "type": "el-input-number",
        "field": "seed",
        "title": "种子（固定正值便于比较）",
        "value": 20261110,
        "props": {
          "min": 0,
          "max": 2147483647,
          "step": 1
        }
      },
      {
        "type": "el-input-number",
        "field": "maxNewTokens",
        "title": "每轮最大音频帧数（不是指定时长）",
        "value": 1500,
        "props": {
          "min": 64,
          "max": 3000,
          "step": 8
        }
      },
      {
        "type": "el-input-number",
        "field": "temperature",
        "title": "采样温度",
        "value": 0.9,
        "props": {
          "min": 0,
          "max": 2,
          "step": 0.05
        }
      }
    ]
  },
  {
    "id": "breeze-tts-2-clone",
    "label": "Breeze TTS 2 · 固定参考配音",
    "type": "audio",
    "mode": [
      [
        "audioReference:1"
      ]
    ],
    "rules": [
      {
        "type": "el-input",
        "field": "referenceText",
        "title": "参考音频完整转写",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 4,
          "placeholder": "填写参考实际说出的全部文字，不能填新台词"
        }
      },
      {
        "type": "el-input-number",
        "field": "seed",
        "title": "种子（固定正值便于比较）",
        "value": 20261110,
        "props": {
          "min": 0,
          "max": 2147483647,
          "step": 1
        }
      },
      {
        "type": "el-input-number",
        "field": "maxNewTokens",
        "title": "每轮最大音频帧数（不是指定时长）",
        "value": 1500,
        "props": {
          "min": 64,
          "max": 3000,
          "step": 8
        }
      },
      {
        "type": "el-input-number",
        "field": "temperature",
        "title": "采样温度",
        "value": 0.9,
        "props": {
          "min": 0,
          "max": 2,
          "step": 0.05
        }
      }
    ]
  },
  {
    "id": "breeze-tts-2-direction",
    "label": "Breeze TTS 2 · 固定参考情绪配音",
    "type": "audio",
    "mode": [
      [
        "audioReference:1"
      ]
    ],
    "rules": [
      {
        "type": "el-input",
        "field": "referenceText",
        "title": "参考音频完整转写",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 4,
          "placeholder": "填写参考实际说出的全部文字，不能填新台词"
        }
      },
      {
        "type": "el-input",
        "field": "emotionText",
        "title": "情绪与表达指令",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 3,
          "placeholder": "例如：克制地生气，压低音量，语速稍慢"
        }
      },
      {
        "type": "el-input-number",
        "field": "cfgScale",
        "title": "指令指导强度 CFG",
        "value": 4,
        "props": {
          "min": 0.1,
          "max": 10,
          "step": 0.1
        }
      },
      {
        "type": "el-input-number",
        "field": "seed",
        "title": "种子（固定正值便于比较）",
        "value": 20261110,
        "props": {
          "min": 0,
          "max": 2147483647,
          "step": 1
        }
      },
      {
        "type": "el-input-number",
        "field": "maxNewTokens",
        "title": "每轮最大音频帧数（不是指定时长）",
        "value": 1500,
        "props": {
          "min": 64,
          "max": 3000,
          "step": 8
        }
      },
      {
        "type": "el-input-number",
        "field": "temperature",
        "title": "采样温度",
        "value": 0.9,
        "props": {
          "min": 0,
          "max": 2,
          "step": 0.05
        }
      }
    ]
  },
  {
    "id": "breeze-tts-2-dialogue",
    "label": "Breeze TTS 2 · 多角色固定参考对话",
    "type": "audio",
    "mode": [
      [
        "audioReference:8"
      ]
    ],
    "rules": [
      {
        "type": "el-input-number",
        "field": "castSize",
        "title": "角色数量（按音频参考顺序绑定）",
        "value": 2,
        "control": [
          {
            "value": 1,
            "condition": ">=",
            "method": "display",
            "rule": [
              "speaker1Name",
              "speaker1ReferenceText",
              "speaker1Emotion",
              "speaker1CfgScale"
            ]
          },
          {
            "value": 2,
            "condition": ">=",
            "method": "display",
            "rule": [
              "speaker2Name",
              "speaker2ReferenceText",
              "speaker2Emotion",
              "speaker2CfgScale"
            ]
          },
          {
            "value": 3,
            "condition": ">=",
            "method": "display",
            "rule": [
              "speaker3Name",
              "speaker3ReferenceText",
              "speaker3Emotion",
              "speaker3CfgScale"
            ]
          },
          {
            "value": 4,
            "condition": ">=",
            "method": "display",
            "rule": [
              "speaker4Name",
              "speaker4ReferenceText",
              "speaker4Emotion",
              "speaker4CfgScale"
            ]
          },
          {
            "value": 5,
            "condition": ">=",
            "method": "display",
            "rule": [
              "speaker5Name",
              "speaker5ReferenceText",
              "speaker5Emotion",
              "speaker5CfgScale"
            ]
          },
          {
            "value": 6,
            "condition": ">=",
            "method": "display",
            "rule": [
              "speaker6Name",
              "speaker6ReferenceText",
              "speaker6Emotion",
              "speaker6CfgScale"
            ]
          },
          {
            "value": 7,
            "condition": ">=",
            "method": "display",
            "rule": [
              "speaker7Name",
              "speaker7ReferenceText",
              "speaker7Emotion",
              "speaker7CfgScale"
            ]
          },
          {
            "value": 8,
            "condition": ">=",
            "method": "display",
            "rule": [
              "speaker8Name",
              "speaker8ReferenceText",
              "speaker8Emotion",
              "speaker8CfgScale"
            ]
          }
        ],
        "props": {
          "min": 1,
          "max": 8,
          "step": 1,
          "precision": 0
        }
      },
      {
        "type": "el-input",
        "field": "speaker1Name",
        "title": "音频参考 1：角色名",
        "value": "角色甲"
      },
      {
        "type": "el-input",
        "field": "speaker1ReferenceText",
        "title": "角色 1：参考音频完整转写",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 3,
          "placeholder": "对应第 1 条音频参考，只计音频"
        }
      },
      {
        "type": "el-input",
        "field": "speaker1Emotion",
        "title": "角色 1：独立情绪与表达",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 2,
          "placeholder": "留空沿用参考；例如：紧张警觉，轻声说话"
        }
      },
      {
        "type": "el-input-number",
        "field": "speaker1CfgScale",
        "title": "角色 1：情绪指令 CFG（有情绪才使用）",
        "value": 4,
        "props": {
          "min": 0.1,
          "max": 10,
          "step": 0.1
        }
      },
      {
        "type": "el-input",
        "field": "speaker2Name",
        "title": "音频参考 2：角色名",
        "value": "角色乙"
      },
      {
        "type": "el-input",
        "field": "speaker2ReferenceText",
        "title": "角色 2：参考音频完整转写",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 3,
          "placeholder": "对应第 2 条音频参考，只计音频"
        }
      },
      {
        "type": "el-input",
        "field": "speaker2Emotion",
        "title": "角色 2：独立情绪与表达",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 2,
          "placeholder": "留空沿用参考；例如：紧张警觉，轻声说话"
        }
      },
      {
        "type": "el-input-number",
        "field": "speaker2CfgScale",
        "title": "角色 2：情绪指令 CFG（有情绪才使用）",
        "value": 4,
        "props": {
          "min": 0.1,
          "max": 10,
          "step": 0.1
        }
      },
      {
        "type": "el-input",
        "field": "speaker3Name",
        "title": "音频参考 3：角色名",
        "value": "角色丙"
      },
      {
        "type": "el-input",
        "field": "speaker3ReferenceText",
        "title": "角色 3：参考音频完整转写",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 3,
          "placeholder": "对应第 3 条音频参考，只计音频"
        }
      },
      {
        "type": "el-input",
        "field": "speaker3Emotion",
        "title": "角色 3：独立情绪与表达",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 2,
          "placeholder": "留空沿用参考；例如：紧张警觉，轻声说话"
        }
      },
      {
        "type": "el-input-number",
        "field": "speaker3CfgScale",
        "title": "角色 3：情绪指令 CFG（有情绪才使用）",
        "value": 4,
        "props": {
          "min": 0.1,
          "max": 10,
          "step": 0.1
        }
      },
      {
        "type": "el-input",
        "field": "speaker4Name",
        "title": "音频参考 4：角色名",
        "value": "角色丁"
      },
      {
        "type": "el-input",
        "field": "speaker4ReferenceText",
        "title": "角色 4：参考音频完整转写",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 3,
          "placeholder": "对应第 4 条音频参考，只计音频"
        }
      },
      {
        "type": "el-input",
        "field": "speaker4Emotion",
        "title": "角色 4：独立情绪与表达",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 2,
          "placeholder": "留空沿用参考；例如：紧张警觉，轻声说话"
        }
      },
      {
        "type": "el-input-number",
        "field": "speaker4CfgScale",
        "title": "角色 4：情绪指令 CFG（有情绪才使用）",
        "value": 4,
        "props": {
          "min": 0.1,
          "max": 10,
          "step": 0.1
        }
      },
      {
        "type": "el-input",
        "field": "speaker5Name",
        "title": "音频参考 5：角色名",
        "value": "角色戊"
      },
      {
        "type": "el-input",
        "field": "speaker5ReferenceText",
        "title": "角色 5：参考音频完整转写",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 3,
          "placeholder": "对应第 5 条音频参考，只计音频"
        }
      },
      {
        "type": "el-input",
        "field": "speaker5Emotion",
        "title": "角色 5：独立情绪与表达",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 2,
          "placeholder": "留空沿用参考；例如：紧张警觉，轻声说话"
        }
      },
      {
        "type": "el-input-number",
        "field": "speaker5CfgScale",
        "title": "角色 5：情绪指令 CFG（有情绪才使用）",
        "value": 4,
        "props": {
          "min": 0.1,
          "max": 10,
          "step": 0.1
        }
      },
      {
        "type": "el-input",
        "field": "speaker6Name",
        "title": "音频参考 6：角色名",
        "value": "角色己"
      },
      {
        "type": "el-input",
        "field": "speaker6ReferenceText",
        "title": "角色 6：参考音频完整转写",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 3,
          "placeholder": "对应第 6 条音频参考，只计音频"
        }
      },
      {
        "type": "el-input",
        "field": "speaker6Emotion",
        "title": "角色 6：独立情绪与表达",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 2,
          "placeholder": "留空沿用参考；例如：紧张警觉，轻声说话"
        }
      },
      {
        "type": "el-input-number",
        "field": "speaker6CfgScale",
        "title": "角色 6：情绪指令 CFG（有情绪才使用）",
        "value": 4,
        "props": {
          "min": 0.1,
          "max": 10,
          "step": 0.1
        }
      },
      {
        "type": "el-input",
        "field": "speaker7Name",
        "title": "音频参考 7：角色名",
        "value": "角色庚"
      },
      {
        "type": "el-input",
        "field": "speaker7ReferenceText",
        "title": "角色 7：参考音频完整转写",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 3,
          "placeholder": "对应第 7 条音频参考，只计音频"
        }
      },
      {
        "type": "el-input",
        "field": "speaker7Emotion",
        "title": "角色 7：独立情绪与表达",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 2,
          "placeholder": "留空沿用参考；例如：紧张警觉，轻声说话"
        }
      },
      {
        "type": "el-input-number",
        "field": "speaker7CfgScale",
        "title": "角色 7：情绪指令 CFG（有情绪才使用）",
        "value": 4,
        "props": {
          "min": 0.1,
          "max": 10,
          "step": 0.1
        }
      },
      {
        "type": "el-input",
        "field": "speaker8Name",
        "title": "音频参考 8：角色名",
        "value": "角色辛"
      },
      {
        "type": "el-input",
        "field": "speaker8ReferenceText",
        "title": "角色 8：参考音频完整转写",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 3,
          "placeholder": "对应第 8 条音频参考，只计音频"
        }
      },
      {
        "type": "el-input",
        "field": "speaker8Emotion",
        "title": "角色 8：独立情绪与表达",
        "value": "",
        "props": {
          "type": "textarea",
          "rows": 2,
          "placeholder": "留空沿用参考；例如：紧张警觉，轻声说话"
        }
      },
      {
        "type": "el-input-number",
        "field": "speaker8CfgScale",
        "title": "角色 8：情绪指令 CFG（有情绪才使用）",
        "value": 4,
        "props": {
          "min": 0.1,
          "max": 10,
          "step": 0.1
        }
      },
      {
        "type": "el-input-number",
        "field": "pauseBetweenSpeakers",
        "title": "每轮之间增加的静音（秒）",
        "value": 0.3,
        "props": {
          "min": 0,
          "max": 3,
          "step": 0.05
        }
      },
      {
        "type": "el-input-number",
        "field": "seed",
        "title": "种子（固定正值便于比较）",
        "value": 20261110,
        "props": {
          "min": 0,
          "max": 2147483647,
          "step": 1
        }
      },
      {
        "type": "el-input-number",
        "field": "maxNewTokens",
        "title": "每轮最大音频帧数（不是指定时长）",
        "value": 1500,
        "props": {
          "min": 64,
          "max": 3000,
          "step": 8
        }
      },
      {
        "type": "el-input-number",
        "field": "temperature",
        "title": "采样温度",
        "value": 0.9,
        "props": {
          "min": 0,
          "max": 2,
          "step": 0.05
        }
      }
    ]
  }
],

  async generateAudio(this: BreezeContext, request: AudioRequest): Promise<MediaAsset[]> {
    const mode = ({ "breeze-tts-2-design": "design", "breeze-tts-2-clone": "clone", "breeze-tts-2-direction": "direction", "breeze-tts-2-dialogue": "dialogue" } as Record<string, string>)[request.model];
    if (!mode) fail("请选择有效的 Breeze TTS 2 模型");
    if (request.images?.length) fail("Breeze TTS 2 只接受台词和音频参考，请移除图片");
    if (request.language && !["zh-CN", "zh", "ZH", "en", "EN"].includes(request.language)) fail("当前 Breeze 入口支持中文与英文");
    const content = text(request.text ?? request.prompt, "台词或对话脚本");
    const other = request.other ?? {};
    const format = request.format ?? "wav";
    if (format !== "wav" && format !== "mp3") fail("Breeze 输出请选择 WAV 或 MP3");
    const sampleRate = numeric(request.sampleRate, 24000, 8000, 48000, "采样率", true);
    if (![8000, 16000, 22050, 24000, 44100, 48000].includes(sampleRate)) fail("采样率不受支持");
    const seed = numeric(other.seed, 20261110, 0, 2147483647, "种子", true);
    const controls = {
      max_new_tokens: numeric(other.maxNewTokens, 1500, 64, 3000, "每轮最大音频帧数", true),
      temperature: numeric(other.temperature, 0.9, 0, 2, "采样温度"), top_k: 50, top_p: 1,
      repetition_penalty: 1.1, depth_temperature: 0.9, depth_top_k: 50, depth_top_p: 1, seed,
    };
    let speakers: BreezeSpeaker[] = [];
    let instruction = "";
    let referenceText = "";
    let dialogue = "";
    let pauseBetweenSpeakers = 0;
    let cfgScale = 1;
    if (mode === "dialogue") {
      speakers = cast(other, request.audios);
      dialogue = script(content, speakers);
      pauseBetweenSpeakers = numeric(other.pauseBetweenSpeakers, 0.3, 0, 3, "轮间静音");
    } else if (mode === "design") {
      if (request.audios?.length) fail("音色设计无需参考，请移除音频；保留已有声线请用固定参考配音");
      instruction = text(other.instruction, "音色描述");
      cfgScale = numeric(other.cfgScale, 4, 0.1, 10, "指令指导强度");
    } else {
      if (request.audios?.length !== 1) fail("固定参考配音请连接恰好一条参考音频");
      referenceText = text(other.referenceText ?? request.audios[0].text, "参考音频的准确转写");
      if (mode === "direction") {
        instruction = text(other.emotionText, "情绪与表达指令");
        cfgScale = numeric(other.cfgScale, 4, 0.1, 10, "指令指导强度");
      }
    }
    const base = baseUrl(this);
    const signal = this.signal ? AbortSignal.any([this.signal, AbortSignal.timeout(1800000)]) : AbortSignal.timeout(1800000);
    const requestId = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    const prompt: BreezePrompt = {
      "1": { class_type: "BreezeTTS2LoadModel", inputs: { model: "bf16 (best quality)", dtype: "bf16", device: "cuda", attention: "sdpa", decode_mode: "cuda_graphs", download_if_missing: false } },
      "3": { class_type: "LocalSaveAudioWAV", inputs: { audio: ["2", 0], filename_prefix: "Toonflow/BreezeTTS2/" + requestId + "/speech" } },
    };
    if (mode === "dialogue") {
      const inputs: Record<string, unknown> = { breeze_model: ["1", 0], text: dialogue, pause_between_speakers: pauseBetweenSpeakers, ...controls };
      prompt["2"] = { class_type: "BreezeTTS2MultiSpeaker", inputs };
      speakers.forEach((speaker, index) => {
        const loadId = String(10 + index);
        const speakerId = String(30 + index);
        prompt[loadId] = { class_type: "LoadAudio", inputs: {} };
        prompt[speakerId] = { class_type: "BreezeTTS2Speaker", inputs: {
          name: speaker.name, audio: "none", reference_audio: [loadId, 0], reference_text: speaker.referenceText,
          auto_transcribe_if_empty: false, instruction: speaker.emotion, cfg_scale: speaker.cfgScale,
        } };
        inputs[`speaker_${index + 1}`] = [speakerId, 0];
      });
    } else {
      const classType = mode === "design" ? "BreezeTTS2VoiceDesign" : mode === "clone" ? "BreezeTTS2VoiceClone" : "BreezeTTS2VoiceDirection";
      const inputs: Record<string, unknown> = { breeze_model: ["1", 0], text: content, cfg_scale: cfgScale, ...controls };
      if (mode === "design") inputs.instruction = instruction;
      else {
        prompt["10"] = { class_type: "LoadAudio", inputs: {} };
        inputs.reference_audio = ["10", 0]; inputs.reference_text = referenceText;
        if (mode === "direction") { inputs.instruction = instruction; inputs.stitch_reference = "none"; }
      }
      prompt["2"] = { class_type: classType, inputs };
    }
    await Promise.all([...new Set(Object.values(prompt).map(item => item.class_type))].map(async type => {
      const schema = await json(this, base, "/object_info/" + type, signal);
      if (!schema[type]) fail("ComfyUI 缺少节点：" + type);
    }));
    // Upload sequentially; each file has a unique request folder and is never overwritten.
    for (let index = 0; index < (request.audios?.length ?? 0); index++) {
      prompt[String(10 + index)].inputs.audio = await upload(this, base, request.audios![index], requestId, index + 1, signal);
    }
    const task: BreezeTask = { kind: "comfy-breeze-tts2", requestId, taskId: "", baseHash: String(this.tool.hash(base)), format, sampleRate };
    await this.saveTaskData?.(task);
    const response = await json(this, base, "/prompt", signal, {
      prompt, client_id: "toonflow-breeze-tts2", extra_data: { toonflow_breeze_tts2: { request_id: requestId } },
    });
    if (typeof response.prompt_id !== "string") throw new Error("提交响应缺少任务 ID，请先核对 ComfyUI 历史");
    task.taskId = response.prompt_id;
    await this.saveTaskData?.(task);
    return poll(this, base, task, signal);
  },

  async resumeTask(this: BreezeContext, data: ProviderTaskData): Promise<MediaAsset[]> {
    const base = baseUrl(this);
    if (data.kind !== "comfy-breeze-tts2" || data.baseHash !== String(this.tool.hash(base))) throw new Error("原任务信息或 ComfyUI 地址不匹配");
    const task = data as BreezeTask;
    const signal = this.signal ? AbortSignal.any([this.signal, AbortSignal.timeout(1800000)]) : AbortSignal.timeout(1800000);
    if (!task.taskId) {
      const queue = await json(this, base, "/queue", signal);
      const history = await json(this, base, "/history?max_items=200", signal);
      const ids = [
        ...[...queue.queue_running, ...queue.queue_pending].filter((item: any[]) => item[3]?.toonflow_breeze_tts2?.request_id === task.requestId).map((item: any[]) => item[1]),
        ...Object.entries(history).filter(([, entry]: any) => entry.prompt?.[3]?.toonflow_breeze_tts2?.request_id === task.requestId).map(([id]) => id),
      ];
      const unique = [...new Set(ids)];
      if (unique.length !== 1) throw new Error("无法唯一定位原 Breeze 任务；未重新提交");
      task.taskId = unique[0];
      await this.saveTaskData?.(task);
    }
    return poll(this, base, task, signal);
  },
};
