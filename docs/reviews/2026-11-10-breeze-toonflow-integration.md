# Breeze TTS 2：Toonflow 固定参考接入记录

日期：2026-11-10（Asia/Shanghai）。本轮在用户恢复接入授权后，实现“设计并试听角色音色 → 固定选定音频 → 多轮对话”，每个角色可独立设置情绪。

## 实现与安装

- 供应商：`comfyBreezeTts2`，版本 `2.0.1`，已保存到工作机 `toonflow/data/providers/comfyBreezeTts2.ts`；[源码副本](../../integrations/toonflow/comfyBreezeTts2.ts)。
- 模型：`breeze-tts-2-design`、`breeze-tts-2-clone`、`breeze-tts-2-direction`、`breeze-tts-2-dialogue`，均已在 Toonflow 的音频生成节点读到。
- 音频生成插件更新为 `2.0.1`。按模型 `audioReference:N` 声明允许多路音频，Breeze 多人模式上限为八路；默认模型仍为一路。MCP `getConfig` 返回实际音频顺序，`setConfig.other` 可填写模型参数。角色较多时参数面板可滚动。
- 角色数量使用 `1–8` 的数字控件，按数量显示各角色的名字、参考完整转写、情绪和 CFG。实际输入 `8` 后显示第八位角色的参数，恢复 `4` 后只显示四位。MCP 修改 `other` 时重新挂载设置面板，避免已打开的表单保留旧值；同样核对了 `8 → 4` 的显示和配置同步。
- 角色字段只定义一次，数量控件通过 `condition: ">="`、`method: "display"` 控制显示，避免切换数量时重建字段、清空原角色配置。实际在界面输入 `4 → 8 → 4`，原四人的名字、转写、情绪和 CFG 全部保留，新增字段按数量显示或隐藏。采用当前安装的 FormCreate `3.3.3` 已提供的规则，见 [官方组件联动说明](https://www.form-create.com/v3/guide/control)。
- [音频节点补丁](../../integrations/toonflow/audioGenerationBreeze.patch) 包含源码、参数面板样式、说明与插件版本变更。没有改动 ComfyUI 节点、模型或依赖。

供应商通过 MCP `addMediaProvider` 安装，音频 UMD 通过 MCP `installNode` 安装；原页面的资源刷新超时，但写入结果已通过服务器文件和安装元数据核对。后续供应商源码修订使用 Toonflow 原生保存接口，并携带最新 revision，避免覆盖并发修改。新页面重新载入后读取了最终参数配置。

## 固定参考与情绪的实际映射

设计模式使用 `BreezeTTS2VoiceDesign`。普通参考模式使用 `BreezeTTS2VoiceClone`；情绪配音使用 `BreezeTTS2VoiceDirection`。多人模式中，角色数量必须与实际音频数量一致，参考按音频顺序绑定。

```text
speakerNName          → BreezeTTS2Speaker.name
第 N 条音频           → LoadAudio → Speaker.reference_audio
speakerNReferenceText → Speaker.reference_text
speakerNEmotion       → Speaker.instruction
speakerNCfgScale      → 有情绪时使用的 Speaker.cfg_scale
```

每个角色都必须有固定参考，关闭空转写自动识别；多人对话中不调用 Voice Design。情绪留空时使用 CFG `1.0` 的克隆基线，有情绪时使用该角色自己的指令与 CFG。每个人的设置作用于该角色的全部轮次，不声明支持单轮 JSON 情绪字段。

台词支持规范的 `名字: 台词` 或仅含 `speaker/text` 的 JSON 数组。适配器在上传和排队前检查角色名、参考数量和脚本映射，拒绝重复角色或未配置的说话人。保存输出固定取节点 `3` 的 WAV，再交给 Toonflow 已有音频工具转码；不把参考或预览误作最终输出。

## 演示画布

当前工程新增 `BreezeTTS2-音色试听与固定参考对话.json`，共十二个节点：四个音色设计、四个普通音频参考、一个多轮对话、两个单人示例和一个使用说明。原有剧情画布没有作为本次操作目标。

四个候选在 Toonflow 中分别生成、回收后，通过工作区文件工具复制到各自普通音频节点的独立目录，再用 `node:setAudio` 设置为固定参考。四份副本与原候选逐字节一致，参考节点与设计节点之间没有动态输出连线；继续生成候选不会自动换掉已选参考。

实际对话保留原四角色、十三轮脚本，为四人分别设置了不同指令。ComfyUI 历史中的四个 Speaker 分别绑定 `LoadAudio 10–13`，实际指令为：

| 角色 | 独立情绪与表达 | CFG |
| --- | --- | --- |
| 旁白 | 平静叙述，音量自然，语速平稳。 | 4.0 |
| 林岚 | 紧张警觉，压低音量，语速稍慢。 | 4.0 |
| 阿卓 | 有些紧张，语速稍快，咬字清楚。 | 4.0 |
| 老周 | 沉着，有些疲惫，语速从容。 | 4.0 |

这些是实际提交参数，不是听感评分。四条参考的生成文本、音色描述与种子沿用 [固定参考清单](../examples/comfyui/breeze-fixed-speaker-references.json)。演示候选尚未登记为创作者采用。

## 实际任务与产物

以下七个 Toonflow 任务及对应 ComfyUI 历史均为 `succeeded/success`。使用 FFprobe 检查回收文件的真实编码、采样率、声道与时长。

| 用途 | Toonflow taskId | ComfyUI prompt_id | 回收规格 |
| --- | --- | --- | --- |
| 旁白音色设计 | `6a037db3-a6ae-4461-9a02-7753afa86a84` | `970a5fba-dc2b-42a9-a9b3-2624db715c5d` | 9.20 秒，WAV，24 kHz 单声道 |
| 林岚音色设计 | `cbc05086-2d1a-4b3f-aeae-a8cca2cd18b1` | `1d58252e-9e4e-44fb-9a43-56deece94d23` | 11.12 秒，WAV，24 kHz 单声道 |
| 阿卓音色设计 | `0023ce2f-0525-4fe2-bb90-47ff2f4cfd2a` | `17a86565-0b0e-4d94-96fb-d239267cf56e` | 9.20 秒，WAV，24 kHz 单声道 |
| 老周音色设计 | `bff902ea-331d-42e2-a127-ef777228fa3c` | `bfb608bf-a686-4cfb-900f-45dc2ee503a6` | 10.40 秒，WAV，24 kHz 单声道 |
| 四角色十三轮对话 | `95585024-6df6-486d-bdc2-e18b053a082f` | `dcb1324b-f83a-4cbf-84eb-40880fb4e743` | 57.64 秒，WAV，24 kHz 单声道 |
| 单人固定参考配音 | `4e734aea-9b1e-41d8-a868-95a56480999c` | `dbf13e4d-e8fd-4185-8562-4a490d3f5ca5` | 2.00 秒，WAV，24 kHz 单声道 |
| 单人参考情绪配音 | `5e08ef1e-4203-4b48-9c8a-5dd7a0deb791` | `df0aa7d7-b478-4add-a24d-298a109ce22d` | 2.04 秒，MP3，48 kHz 单声道 |

演示画布的多轮对话输出位于工作区相对路径：

```text
assets/d1f7b21e-2697-4c76-8e67-9f4bd00ae713/audio955850246df6486dbdc2e18b053a082f0.wav
```

对话任务开始后刷新了页面，重新定位连接并打开演示画布，恢复并回收的 Toonflow taskId 仍为 `95585024-6df6-486d-bdc2-e18b053a082f`，ComfyUI prompt_id 仍为 `dcb1324b-f83a-4cbf-84eb-40880fb4e743`。角色参数和四路参考顺序在恢复后保留，没有重新生成参考。

## 验证边界

- 供应商源码完成严格 TypeScript 检查，并由 Toonflow 的真实 VM 检查接口加载；插件完成既有 `typecheck` 和 Vite 构建，安装产物与构建文件一致。
- 通过真实节点的 `setConfig`、`setPrompt`、`generateAudio` 和 `getGenerationStatus` 完成提交与回收，不把 ComfyUI 单独成功记成 Toonflow 成功。
- 核对角色数、参考顺序、各自情绪的实际界面和 ComfyUI 输入；参数面板采用可滚动布局。
- 用原生供应商调试接口提交未配置的脚本角色，收到“脚本角色……没有对应参考”的明确错误，且没有发起网络请求；错误在上传和排队前暴露。
- 本轮实际生成验证到四位角色。最多八位来自当前节点 schema 与适配器限制，不代表八人长篇对话已做听审。
- 技术生成、媒体规格和参考绑定已核对；情绪自然度、声线漂移与每个字的读音仍需回听。新一轮四条候选没有另做完整听审，不将此前参考的转写验证当成这轮听审通过。

日常操作与限制统一见 [Breeze 使用指南](../workflow/references/breezetts2-guide.md#toonflow先试听音色再固定参考对话)。
