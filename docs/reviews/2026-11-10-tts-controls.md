# IndexTTS 2.5 与 Breeze TTS 2 控制能力核对

日期：2026-11-10（Asia/Shanghai）。任务：研究情绪、控制标签、音色设计、多人对话、停顿与多音字；给现有工作流补说明，建立 Breeze 试听流程并更新 Director 文档。

本页保留最初的 ComfyUI 研究与固定参考验证。后续已完成 Toonflow 接入，最新安装、角色参数与生成验证见 [Toonflow 接入记录](2026-11-10-breeze-toonflow-integration.md)。

## 核对结论

- IndexTTS 2.5 的固定情绪向量顺序为 `happy / angry / sad / afraid / disgusted / melancholic / surprised / calm`。本地 ComfyUI 和 Toonflow 已接通独立情绪文本，未暴露向量、情绪参考音频与强度滑杆。
- Toonflow 实时 `listMediaProviders` 返回 `comfyIndexTts25` 的 `emotionText` 输入，供应商 `loadError` 为空；源码可追踪到 worker 的 QwenEmotion 路径。此次没有修改 Toonflow 供应商或节点代码。
- Breeze 使用自然语言 instruction 控制音色与表演，已确认声音事件为中文 `[笑] / [咳嗽] / [清嗓子] / [叹气]` 及对应英文形式。当前没有核实到拼音／音素强制控制与 SSML 停顿接口。
- IndexTTS 当前单次调用只有一个声线参考，多人需分角色逐轮合成后拼接。Breeze ComfyUI 插件提供最多八个 Speaker 的调度与拼接；不自动生成多人重叠抢话，也没有解析单轮 `emotion/instruction/pause` JSON 字段。
- Toonflow 同日媒体供应商列表中未发现 Breeze 适配器；本文的 Breeze 运行结果来自 ComfyUI。

详细操作见 [IndexTTS 2.5 指南](../workflow/references/indextts25-guide.md) 与 [Breeze TTS 2 指南](../workflow/references/breezetts2-guide.md)。部署默认值见 [本地模型能力](../workflow/references/local-model-capabilities.md)。

## 来源与版本

| 对象 | 本次依据 |
| --- | --- |
| IndexTTS 官方引擎 | 本机 `tools/opensource/indexTts25`，提交 `d9e41aac89fd00b3d71497fddb287b7f24613712`；README 与 `indextts/infer_v2_5.py` |
| IndexTTS 本地封装 | `ComfyUI-clean/runtime/custom_nodes/local_index_tts25/__init__.py`、`tools/opensource/indexTts25Local/worker.py` |
| Toonflow | MCP `getAppState`、`listMediaProviders`，`data/providers/comfyIndexTts25.ts`；未修改作品画布 |
| Breeze ComfyUI 插件 | `ComfyUI-clean/runtime/custom_nodes/ComfyUI-Breeze-TTS-2`，提交 `53d899bfaa1ea37badc58f901900c068a9755116`；`nodes.py/runtime.py` 与实时 `object_info` |
| 外部一手资料 | [IndexTTS 官方仓库](https://github.com/index-tts/index-tts)、[Breeze 官方模型卡](https://huggingface.co/BreezeBlue/Breeze-TTS-2)、[Breeze 官方推理仓库](https://github.com/breezeblue-ai/breeze-tts)、[ComfyUI 插件](https://github.com/Saganaki22/ComfyUI-Breeze-TTS-2) |

核对时 ComfyUI `/system_stats` 返回核心 `0.44.0`、前端 `1.57.6`。沿用现有 BF16 权重、CUDA、SDPA 与 CUDA graphs；未安装节点、升级依赖或下载模型。

## 工作流交付

ComfyUI 工作流位置：`/home/layton/WorkSpace/ComfyUI-clean/user/default/workflows/音频处理/配音/`。

现有三份工作流增加 MarkdownNote 说明卡：

- `IndexTTS25-参考音频配音.json`
- `BreezeTTS2-BF16-标准参考配音.json`
- `BreezeTTS2-BF16-双人对话.json`

写入前读取原图并检查未被并发修改；原有执行节点、控件值与连线逐项保持一致，只增加说明节点与说明分组。原图备份位于 ComfyUI 用户目录 `workflow-docs/音频处理/配音/20261110-before-notes/`，没有覆盖旧生成素材。

新增三份工作流，均有说明卡、WAV 保存和 Preview Audio：

- [BreezeTTS2-BF16-音色设计与试听](../examples/comfyui/BreezeTTS2-BF16-音色设计与试听.json)：无需参考音频，描述音色后直接生成与试听。
- [BreezeTTS2-BF16-参考声线情绪控制](../examples/comfyui/BreezeTTS2-BF16-参考声线情绪控制.json)：参考音频、准确转写、独立 instruction 与新台词。
- [BreezeTTS2-BF16-四角色悬疑对话](../examples/comfyui/BreezeTTS2-BF16-四角色悬疑对话.json)：旁白、林岚、阿卓、老周，十三轮；[独立脚本](../examples/comfyui/breeze-four-speaker-dialogue.json) 可粘贴到 Multi-Speaker。

工作流通过 ComfyUI `/userdata` 保存并回读比对，仓库新增图副本与服务端一致。GUI 图与实际 API 提交使用相同输入，生成历史同时保存对应 GUI 图。

## 实际生成

以下文件均已生成，FFprobe 与 PCM 解码确认规格、非零时长和有效音频数据。这里确认技术生成与媒体可播放，尚未确认情绪自然度、克隆相似度、每个字的发音或角色长期一致性，未登记为创作者采用。

输出根目录：`/home/layton/WorkSpace/ComfyUI-clean-data/output/`。

| 用途 | ComfyUI prompt_id | 文件（相对输出根目录） | 实测规格 |
| --- | --- | --- | --- |
| Breeze 描述设计音色 | `08391036-91f1-487c-a954-2a856492e6e2` | `BreezeTTS2/音色设计/voice_00001_.wav` | 6.16 秒，24000 Hz，单声道 PCM16 |
| Breeze 参考声线情绪控制 | `ad1128ae-42c8-44fb-9de9-bf1138b9988c` | `BreezeTTS2/情绪控制/speech_00001_.wav` | 4.08 秒，24000 Hz，单声道 PCM16 |
| Breeze 四角色十三轮，最终文稿 | `e8d8def6-0eea-48ea-b82d-218fb9b34a1b` | `BreezeTTS2/四角色对话/dialogue_00002_.wav` | 58.92 秒，24000 Hz，单声道 PCM16 |
| IndexTTS 独立情绪文本 | `a0dda365-c44c-44cf-977a-6d22f73b6059` | `IndexTTS25/情绪控制验证/speech_00001_.wav` | 5.30576 秒，22050 Hz，单声道 PCM16 |

四角色初版任务 `4e62fbf6-cb0a-4ac7-b3fe-95c3a539ad46` 的 `dialogue_00001_.wav`（59.08 秒）仍保留。修正一处“请借灯的人开个门”的用词后，更新脚本、GUI 图与 API 输入并生成上表最终版；旧 take 未覆盖。

Breeze 三份最终图均使用固定种子 `20261110`、标准采样默认值、每轮 `max_new_tokens=750`。多人节点设置 `pause_between_speakers=0.25`，四位 Speaker 全部采用描述设计（`audio=none`、CFG `4.0`），关闭自动转写。最终总时长由模型实际输出决定，不是预设时长保证。

IndexTTS 验证输入：

```text
参考：BreezeTTS2/标准参考男声.wav（现有文件）
text：别担心，我会等你回来。
emotion_text：悲伤，压抑。
language：ZH
duration_factor：1.0
seed：20261110
release_after_generation：true
```

worker 本次日志实际输出了情绪解析结果：

```json
{"happy":0.0,"angry":0.01,"sad":0.95,"afraid":0.01,"disgusted":0.01,"melancholic":0.01,"surprised":0.0,"calm":0.01}
```

这证明本地情绪文本路径被执行，数值是解析器向量，不是听感评分。验证从 ComfyUI 提交；Toonflow 字段已通过实时元数据和源码核对，本轮未另外在作品画布上提交一条重复任务。任务完成后 IndexTTS `/health` 返回 `busy=false`、`model_loaded=false`，模型卸载不等同于独立进程的全部 CUDA 上下文退出。

## 检查范围

- 三份新增 GUI 图转换为 API 输入后均被 `/prompt` 接受，`node_errors` 为空，最终历史为 `success`；保存与试听节点均返回真实媒体。
- 检查新增图连线两端类型、输入槽位、连线 ID、从左到右的数据流与节点矩形无重叠。
- 使用安装节点的实际 `_parse_script` 解析逻辑确认复杂例子为四个已连接角色、十三轮，独立脚本与工作流脚本一致。
- IndexTTS 示例的 `HANG2 / XING2 / DEI3` 已在安装词表中查到；本轮未生成这些发音对照，不将词表存在记为听审成功。
- 检查文档本地链接、工作流副本与服务端回读一致，以及本轮文件的差异空白检查；保留仓库中本轮开始前已有的其他未提交修改。

## 后续：固定参考的四角色、多轮对话

用户反馈无参考设计模式下角色声音容易变化后，暂停 Toonflow 接入，新增两份 ComfyUI 工作流。本次没有安装 Toonflow 供应商或修改 Toonflow 节点。

- [四角色参考音色库-生成与试听](../examples/comfyui/BreezeTTS2-BF16-四角色参考音色库-生成与试听.json)：为旁白、林岚、阿卓、老周各生成一条中性试音候选，分别保存并提供播放。
- [四角色固定参考-多轮对话](../examples/comfyui/BreezeTTS2-BF16-四角色固定参考-多轮对话.json)：四个 Load Audio 分别接到四个 Speaker.reference_audio，再接 Multi-Speaker；沿用原十三轮脚本。四位角色均为 CFG `1.0`、instruction 留空、自动转写关闭的参考克隆基线。

两图已保存到同一个 ComfyUI `音频处理/配音/` 目录，仓库副本与 `/userdata` 回读一致。对话图没有 Voice Design 节点，常规修改台词后直接复用固定参考。配套参考清单见 [breeze-fixed-speaker-references.json](../examples/comfyui/breeze-fixed-speaker-references.json)，包含实际输入文件、原始输出、种子、指令、参考文字与 ASR 结果；这些候选尚未登记为创作者采用。

| 任务 | prompt_id | 结果 |
| --- | --- | --- |
| 四位角色参考生成 | `48818988-f142-4bda-ad02-e5d1552016b4` | 旁白 9.20 秒、林岚 11.12 秒、阿卓 9.20 秒、老周 10.40 秒；均为 24000 Hz、单声道 PCM16 |
| 固定参考十三轮对话 | `a90db5f9-c3cf-4200-8840-ea07b21430db` | 62.44 秒，24000 Hz、单声道 PCM16；WAV 与 Preview Audio 均返回真实文件 |

参考原音保留在 `ComfyUI-clean-data/output/BreezeTTS2/固定角色参考/20261110/`；四份参考通过 `/upload/image` 上传到输入目录的 `BreezeTTS2/固定角色参考/20261110-48818988/`，没有覆盖已有输入。整段对话位于：

```text
/home/layton/WorkSpace/ComfyUI-clean-data/output/BreezeTTS2/四角色固定参考多轮对话/dialogue_00001_.wav
```

本轮实际检查了四路参考、四角色十三轮的提交和回收；两个任务均为 `success`，`node_errors` 为空。对话历史中四位 Speaker 均显示 reference transcript；四条 `reference_audio` 连线真实存在，图中不含无参考设计节点。音频 PCM 解码后有有效样本，最终对话共 1498560 个样本。

参考文字初检中，medium 将开头“你好”识别为“您好”或“一号”；随后用已安装的 large-v3-turbo 复核，四条完整转写均与生成输入一致（忽略标点）。保留原参考文字和原音，没有按初检结果改词或重录。ASR 一致不等于读音、年龄感、情绪或声线一致性已完成听审。

检查了新图的节点布局无重叠、连线类型与槽位、服务端和仓库副本一致。最多八角色来自当前 schema 与实现，本轮只运行四角色。单个 Speaker 仍只有一路独立参考音频；多参考在这里表示不同角色各自绑定参考，不是同一角色多条参考融合。
