# Director

Director 用于制作 AI 短剧、漫剧和叙事短片。Agent 协助编剧和导演完成剧本、视觉设定、分镜、灯光与调度设计、生成提示词和制作记录。以当前作品的剧本、素材和已确认的分镜为准，只处理用户指定的阶段。发现剧情、人物或镜头要求有冲突时，先指出冲突，再继续能独立完成的部分。

## 项目目录

`Director/` 存放共用规则和 skill，可以独立放在 CachyOS 的 `WorkSpace/` 下。作品放在 Toonflow 允许访问的工作区中。按现有安装记录，目录布局如下。

```text
/home/layton/WorkSpace/
├── Director/
│   ├── AGENTS.md
│   ├── docs/workflow/
│   └── .agents/skills/
└── toonflow/data/workspaces/
    └── <项目名>/
```

1. 在 Toonflow 的「选择服务器工作目录」中，新建 `<项目名>/` 文件夹并选中它。打开项目后，以 Toonflow 返回的实际路径为准。
2. 在 CachyOS 上用 Codex 打开同一个作品目录并新建会话。Codex 从 `workspaces/` 自动加载 `Director/AGENTS.md`，发现 `Director/.agents/skills/` 下的共用 skill，再读取作品自己的 `AGENTS.md`（如有）。
3. 剧本、设定和制作记录保存在当前作品目录，沿用已有结构。用户只要文稿或提示词时，直接交付。切换作品时，重新确认 Agent 打开的目录与 Toonflow 当前项目一致。

共用规则和 skill 在 `Director/` 中维护。CachyOS 上的 Toonflow `workspaces/` 通过符号链接引用这两处内容。

## 制作文档入口

按用户要求选择阶段。已有可用交付物时，直接从当前阶段开始。跨阶段任务依次读取命中的文档，沿用同一作品目录和编号。共用文档和 Skill 的链接以 Director 仓库为准。若通过 Toonflow 工作区的符号链接加载本文件，先用 `realpath` 找到 `AGENTS.md` 的源文件，再从源目录打开 `docs/workflow/`。

| 当前要做什么 | 先读 |
| --- | --- |
| 从点子、梗概或原著确定故事方向 | [01 故事构建](docs/workflow/01-story.md) |
| 把故事拆成连续的几集 | [02 分集规划](docs/workflow/02-episodes.md) |
| 写或改单集剧本 | [03 单集剧本](docs/workflow/03-screenplay.md) |
| 定人物、造型、场景和道具 | [04 视觉设定](docs/workflow/04-visual-assets.md) |
| 写出图提示词、准备参考图或补关键帧 | [05 图片与参考素材](docs/workflow/05-image-references.md) |
| 拆镜、排镜序、写冻结关键帧 | [06 分镜与镜序](docs/workflow/06-storyboard.md) |
| 为已确认的镜头写 H3 提示词 | [07 H3 视频提示词](docs/workflow/07-h3-prompts.md) |
| 在 Toonflow 提交 H3 并收回视频 | [08 Toonflow 视频生成](docs/workflow/08-toonflow-generation.md) |
| 检查视频、选 take 或定位返工 | [09 视频验收与返工](docs/workflow/09-video-review.md) |

## 工作环境

| 组件 | 入口 |
| --- | --- |
| CachyOS 工作机 | `ssh layton@cachyos.home.arpa`，RTX 5070 Ti，16 GB 显存 |
| Toonflow 网页 | 在工作机上打开 `http://127.0.0.1:3000/`。从其他机器访问时，先建立下方的 SSH 转发，再打开 `http://127.0.0.1:13000/` |
| Toonflow MCP | `http://cachyos.home.arpa:3000/mcp`，使用已授权的凭据 |
| ComfyUI | `http://cachyos.home.arpa:8189`，操作前先读工作机上的 `/home/layton/WorkSpace/ComfyUI-clean/AGENTS.md` |

```sh
ssh -o ExitOnForwardFailure=yes -N -L 127.0.0.1:13000:127.0.0.1:3000 layton@cachyos.home.arpa
```

- 操作 Toonflow 前，用工作机 MCP 的 `getAppState` 核对连接、项目实际路径和当前画布。写入画布时使用返回的 `connectionId`、`directory` 和 `canvasId`。切换项目或画布后重新获取状态。
- 画布、节点和 Toonflow 中打开的文档通过 MCP 修改。先查节点支持的函数和参数，再调用对应工具。配置供应商、模型或插件前，用 `listAppOperations` 查询操作和参数。凭据保存在 `Director/` 目录外。用户明确要求委托 Toonflow 内置 Agent 时，才调用 `runAgent`。
- 生成前检查服务状态、所选预设和实际参考输入。H3 的可用模式、参数和有效时长以当前工作流为准。按用户授权提交任务，跟进实际输出。遇到超时，先查原任务再决定是否重试。

## H3 提示词项目规则

本节适用于 H3 分镜、首帧和视频提示词。**与任何 Skill 的规则、建议或默认值冲突时，以本节为准。** 其余提示词格式按 MiniMax 官方指南。生成模式和参数以当前 Toonflow 节点及其 ComfyUI 工作流为准。

### 查阅与编译

编写、改写、审核或修复 H3 提示词前，查阅以下四项。已在本会话完整读过且内容未变时，可复用。把结论合成一版提示词。

1. [h3-cinematic-director](.agents/skills/h3-cinematic-director/SKILL.md) 设计景别、站位、表演和运镜。
2. [h3-prompt-writing](.agents/skills/h3-prompt-writing/SKILL.md) 负责最终格式和参考标签。基础模式读 [base-en.txt](.agents/skills/h3-prompt-writing/references/base-en.txt)，Ref2VA 读 [ref-en.txt](.agents/skills/h3-prompt-writing/references/ref-en.txt)。
3. [minimax-h3-prompt-writer](.agents/skills/minimax-h3-prompt-writer/SKILL.md) 检查参考、对白、声音和续镜，排查不同入口的差异。
4. [minimax-h3](.agents/skills/minimax-h3/SKILL.md) 查本地 ComfyUI 的 H3 节点、参考接线、模型配置和运行故障。

### 提示词怎么写

- **切镜默认不写时间戳。** 用 `[Shot N]` 按顺序标镜头。写清画面、动作和声音如何承接。具体切点由 H3 决定。总时长在节点设置。首帧或首尾帧模式保留必要的帧对齐声明。
- **写清镜头运动。** 说明固定机位，或写明运镜类型、方向、速度和最后的构图。跟拍时说明跟谁。连续运镜和动作阶段写在同一镜内。
- **保留对白结束符。** 中文对白逐字写入 `<d>`，保留语言标签。说话人、表演和声线写在标签外。完整发声的 `</d>` 后加 `[END_OF_DIALOGUE]`，跨切镜的未完句等说完再加。结束符是项目试验项，被念出时再做单变量对照。给对白和反应留足时间。用动作或事件交代音效、环境声和配乐的起落。
- **让表演和动作看得清。** 关键表情、持物或接触优先用近景。反应镜写触发、情绪、可见反应和落点。接触动作写清谁用哪只手碰到哪里，以及最后的状态。
- **按实际参考写。** 核对挂载顺序及每份参考的用途。用英文描述画面和动作，保留对白、歌词和画内文字原文。出片后检查动作终点、对白和前后镜连续性。返工时保留上一版，每次先改一个变量。

## 中文写作

默认用简体中文。起草、重写或润色剧本、创作阐述、项目说明、制作记录和对外文案时，按需读 [natural-zh-writing](.agents/skills/natural-zh-writing/SKILL.md)。保留事实、条件、判断强度和作者语气。只改影响理解或节奏的地方，已经通顺的句子可以保留。

写对白、分镜和提示词时，先按对应阶段的制作 skill 处理，再用 `natural-zh-writing` 检查中文表达。保留角色口吻、已确认的对白原文和镜头意图。提示词的字段、标签、参考顺序和时间约束以所用模型及工作流的要求为准。
