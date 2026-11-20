# IndexTTS 2.5 使用指南

2026-11-10 核对官方文档、已安装引擎、ComfyUI `object_info`、本地 worker 和 Toonflow 媒体供应商。下文区分模型能力与当前入口；支持某项控制不代表每种情绪、读音已通过听审。部署路径、采样率、资源释放和参数默认值统一见 [本地部署能力](local-model-capabilities.md#indextts-25本地参考音频配音)。

## 选择入口

| 需求 | 官方引擎 | 当前 ComfyUI `LocalIndexTTS25` | 当前 Toonflow |
| --- | --- | --- | --- |
| 参考音频克隆声线 | `spk_audio_prompt` | 一路 `reference_audio` | 连接一段参考音频 |
| 独立情绪描述 | `use_emo_text=True`、`emo_text` | `emotion_text`，服务按需加载 QwenEmotion | **已支持**“情绪提示（选填）”，字段 `emotionText` |
| 从台词自动推断情绪 | 开启 `use_emo_text`，不另传 `emo_text` | 未暴露独立开关；空情绪文本会关闭该路径 | 未暴露独立开关 |
| 八维数值情绪 | `emo_vector` | 未暴露 | 未暴露 |
| 独立情绪参考音频 | `emo_audio_prompt` | 未暴露第二路参考 | 未暴露 |
| 情绪强度 | `emo_alpha` | 未暴露，worker 沿用引擎默认 `1.0` | 未暴露 |
| 时长倾向 | `duration_factor` | `duration_factor` | `durationFactor` |
| 指定多音字读法 | `<文字\|发音>` | 原样传递文本 | 原样传递文本 |
| 一条脚本自动分角色 | 当前 `infer` 是单说话人调用 | 一次一位说话人 | 一个节点只接一段声线参考 |

ComfyUI 中打开 `音频处理/配音/IndexTTS25-参考音频配音`。本轮为已有工作流增加了说明卡，保留其原参考、台词和参数；其中保存的时长系数仍应由使用者按本次目标核对。

## 情绪怎么控制

官方八维向量的顺序固定，不能交换：

| 位置（从 1 起） | 名称 | 中文含义 |
| --- | --- | --- |
| 1 | `happy` | 开心 |
| 2 | `angry` | 愤怒 |
| 3 | `sad` | 悲伤 |
| 4 | `afraid` | 恐惧 |
| 5 | `disgusted` | 厌恶 |
| 6 | `melancholic` | 低落、忧郁 |
| 7 | `surprised` | 惊讶 |
| 8 | `calm` | 平静 |

`emo_vector=[0,0,0.5,0,0,0,0,0]` 是偏悲伤的配置示例，向量数值不是概率。引擎可用 `emo_alpha` 缩放向量；不要把每一维拉满，或将输入值直接解释为最终听感强度。`sad` 与 `melancholic` 的听感差异需要用相同参考和台词对照。

当前 ComfyUI 与 Toonflow 可直接使用的方式是**台词与情绪分开填**：

```text
text / 台词：别担心，我会等你回来。
emotion_text / 情绪提示：悲伤，压抑。
```

情绪描述会先由 QwenEmotion 转换到八维，再交给合成模型。它适合描述情绪；“贴耳说话、距离十厘米、先咳嗽再笑、精确停五百毫秒”并非这个字段已经接通的独立控制。描述写得复杂不会增加新的控制维度。

调试时固定参考、台词、正种子和 `duration_factor=1.0`，先比较情绪留空与一条简短描述。只在情绪有效后再调整其他变量。文字中“稍微、非常”等强弱修饰经过情绪解析器，不能替代数值强度控制。

直接使用官方 Python 引擎时，可另设情绪向量、参考和强度。例如下面两次调用属于不同控制方式，当前 ComfyUI 工作流不能直接填写这些尚未暴露的参数：

```python
from indextts.infer_v2_5 import IndexTTS2

tts = IndexTTS2(
    cfg_path="checkpoints/config.yaml",
    model_dir="checkpoints",
    use_bf16=True,
    use_qwen_emo=True,  # 文本转情绪需要这个模型
)

# 数值情绪：悲伤。可复用已加载的引擎；该调用本身不需要文本解析。
tts.infer(
    spk_audio_prompt="voice.wav", text="别担心，我会等你回来。",
    lang="ZH", output_path="sad.wav",
    emo_vector=[0, 0, 0.5, 0, 0, 0, 0, 0], use_random=False,
)

# 文本转情绪：情绪说明不会作为台词朗读。
tts.infer(
    spk_audio_prompt="voice.wav", text="别担心，我会等你回来。",
    lang="ZH", output_path="emotion-text.wav",
    use_emo_text=True, emo_text="悲伤，压抑。", emo_alpha=0.6,
    use_random=False,
)
```

这是官方接口示例，未在本轮另行执行。独立情绪参考用 `emo_audio_prompt`，声线身份仍由 `spk_audio_prompt` 提供；不要把两者的用途混淆。向量／文本情绪路径会清除外部情绪参考，不把三个方式同时堆到一次调用中。

## Toonflow 的情绪输入在哪里

选择音频生成节点的供应商“本地 ComfyUI · IndexTTS 2.5”，模型“IndexTTS 2.5 · 参考音频配音”，在模型参数中填写“情绪提示（选填）”。提示框本体仍填台词，连接端口只放该说话人的参考音频。

2026-11-10 的实时 `listMediaProviders` 返回了这个输入，且供应商无加载错误。源码路径为：

```text
Toonflow other.emotionText
  → LocalIndexTTS25.inputs.emotion_text
  → worker 请求 emotion_text
  → 懒加载 qwen0.6bemo4-merge
  → infer(use_emo_text=True, emo_text=...)
```

因此当前部署支持独立情绪描述。没有看到输入时，先检查选中的供应商、模型以及参数面板；旧页面需要重新载入供应商元数据时，再刷新并回读。不要把情绪说明塞到台词里补偿。当前没有八维滑杆、`emo_alpha` 或第二路情绪参考输入，若要这些能力，需要同时修改适配器、ComfyUI 节点和 worker。

## 多音字与专名

2.5 使用 `<文字|发音>`，中文发音按安装词表使用大写拼音与声调数字。例如：

```text
他去银<行|HANG2>办事，办完再步<行|XING2>回家。
明天还<得|DEI3>去一趟。
```

一次只标确实读错的字，先核对目标读音和模型目录的 `pinyin.vocab`。不把旧版 IndexTTS 2 的裸 `HANG2` 写法当成 2.5 的默认写法。英文可用 CMU 音素、日文可用假名，但 Toonflow 当前语言选择只映射 `EN/ZH`；不能据模型支持语言就宣称现有 Toonflow 入口已支持日语等全部语言。

字幕与已确认剧本保留原汉字，另记实际合成输入。ASR 结果可帮助定位，是否误读以原声为准，见 [配音与时间对齐](voice-and-timing.md#asr-用于查漏和定位原声决定发音判断)。

## 停顿、语速与标签

| 要求 | 当前可用方式 | 边界 |
| --- | --- | --- |
| 自然停顿 | 按句意使用逗号、句号、问号和语义分组 | 标点不对应固定毫秒数，堆省略号不可靠 |
| 精确空白 | 在完整语义边界拆段，分别生成后插入指定时长静音 | 保留自然尾音，听接缝；字幕同步更新 |
| 生成时整体快慢 | `duration_factor` 范围 `0.5–2.0`，正常基准显式填 `1.0` | 小于 1 偏快，大于 1 偏慢，不等于精确播放倍率 |
| 内部切块间隔 | 官方 `interval_silence` 默认 `200` 毫秒 | 当前节点未暴露，且针对内部合成切块，不能指定任意句中位置 |
| 笑、咳嗽或 SSML | 当前入口没有确认支持的对应控制接口 | 不套用 Breeze 的 `[笑]`、`[叹气]`，也不承诺 `[pause]` 或 `<break>` 有效 |

后期播放倍率和生成时长系数分别记录，避免重复加速，见 [语速基准](voice-and-timing.md#语速只从明确的基准调整)。

## 多人对话怎么做

当前官方单次推理和本地节点只有一个声线参考。可以生产多人对话，方法是**按角色逐轮合成，再拼接**；它没有 Breeze ComfyUI 多人节点那种脚本调度入口。

例如甲说两句、乙接一句：三次调用分别使用 `甲.wav / 乙.wav / 甲.wav`，保持各自参考与种子，分别填写情绪；完成后在时间线上安排停顿。把“甲：……乙：……”直接粘进一个 IndexTTS 节点不会自动绑定两种声线，说话人名字还可能被读出。重叠抢话需要各自生成音轨再混音。

## 来源与核对记录

- [IndexTTS 官方说明](https://github.com/index-tts/index-tts)：情绪四种路径、八维顺序、时长系数和发音标注。
- [官方 2.5 推理实现](https://github.com/index-tts/index-tts/blob/main/indextts/infer_v2_5.py)：单路说话人、情绪转换与内部切块间隔。源码包含字音示例，示例中的目标读音仍需自行核对。
- 本机依据：`ComfyUI-clean/runtime/custom_nodes/local_index_tts25/__init__.py`、`tools/opensource/indexTts25Local/worker.py`、`toonflow/data/providers/comfyIndexTts25.ts`，以及实时 MCP `listMediaProviders` 和 ComfyUI `object_info`。
- 工作流与生成验证状态见 [TTS 核对记录](../../reviews/2026-11-10-tts-controls.md)。本页不替已采用作品重新决定是否使用情绪控制。
