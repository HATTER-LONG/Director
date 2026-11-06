# Director

Director 为使用 Toonflow 制作 AI 短剧、漫剧和叙事短片的 Codex 项目提供共用规则与制作技能。制作约定和工作机配置见 [AGENTS.md](AGENTS.md)。

## H3 + Toonflow 日常流程

平时从当前做到的阶段开始。已有正式剧本就拆镜，已有分镜就细化要投产的镜头，已有生成片段就检查接镜或开始剪辑。技能入口都在 [`.agents/skills/`](.agents/skills/)。在 Codex 里可以点名技能，并说明作品、集号、镜号和本次要交付的内容。

| 阶段 | 常用技能 | 交给下一步的内容 |
| --- | --- | --- |
| 1. 想法与分集 | [`short-drama`](.agents/skills/short-drama/SKILL.md) 管新建、续做和项目进度。 [`short-drama-develop`](.agents/skills/short-drama-develop/SKILL.md) 把点子变成系列设定和分集计划。 | 创作简报、角色目标与阻力、分集地图。每集写清局面如何变化，以及下一集接什么。 |
| 2. 单集剧本 | [`short-drama-write`](.agents/skills/short-drama-write/SKILL.md) 写场次、可拍动作和对白。 | `剧本.md` 或现有剧本文档。标清哪些话要在画面里说，哪些可以用画外声。 |
| 3. 视觉资产 | [`short-drama-assets`](.agents/skills/short-drama-assets/SKILL.md) 拆人物、造型、场景和道具。 [`short-drama-image-prompts`](.agents/skills/short-drama-image-prompts/SKILL.md) 为缺失的资产写图片提示词。 | `视觉设定.md`、缺图清单和 `图片提示词.md`。优先复用已有的人物与场景图，按剧情变化补造型或道具状态。 |
| 4. 分镜与镜序 | [`short-drama-storyboard`](.agents/skills/short-drama-storyboard/SKILL.md) 拆镜并写冻结关键帧。 [`shot-sequencing`](.agents/skills/shot-sequencing/SKILL.md) 在生成前排镜，确定切点、进出画方向和动作接力。 | `分镜.md` 或现有镜头卡。每镜有稳定镜号、画面目的、起始画面、动作终点和需要挂的参考。 |
| 5. H3 提示词 | [`h3-cinematic-director`](.agents/skills/h3-cinematic-director/SKILL.md) 细化表演、运镜和动作。 [`h3-prompt-writing`](.agents/skills/h3-prompt-writing/SKILL.md) 按实际 H3 模式编排最终字段、参考标签、对白和声音。整集写逐镜提示词时用 [`short-drama-video-prompts`](.agents/skills/short-drama-video-prompts/SKILL.md) 组织交付。 | `视频提示词.md` 或镜头节点的最终提示词，以及逐镜参考顺序、时长和声音要求。每镜保留一版当前可用的提示词。 |
| 6. Toonflow 生产 | [`toonflow`](.agents/skills/toonflow/SKILL.md) 查当前项目、画布、节点和可用预设，经授权后配置参考、提交 H3 并跟进状态。 | 生成任务 ID、产物位置和参数记录。参考图、起始帧或上一镜尾帧先核对实际素材，再按节点支持的模式接入。 |
| 7. 验收与返工 | [`continuity-checking`](.agents/skills/continuity-checking/SKILL.md) 对照生成片段和相邻切点。 `h3-cinematic-director` 可按问题只调整一个变量。 | 采用的 take、具体问题和补拍清单。核对身份、视线、持物手、动作落点及关键对白。 |
| 8. 剪辑与导出 | [`short-drama-edit`](.agents/skills/short-drama-edit/SKILL.md) 写剪辑单，用 FFmpeg 套剪、加字幕、处理声音并导出。 | `剪辑单.md`、可播放成片及所需字幕文件。剪辑按片段实际时长取入出点。 |

新项目可按表建立需要的创作文档。已有 Toonflow 项目沿用当前目录、剧本、镜号和画布。一个镜号贯穿分镜、节点、生成版本和剪辑单，重跑时给同一镜追加 take 编号。

### 操作 Toonflow 前核对什么

1. 打开工作机上的目标项目和画布。用 `getAppState` 读取当前的 `connectionId`、`directory`、`canvasId`，再查目标视频节点支持的函数与参数。切换项目或画布后重新定位。
2. 确认当前 H3 模式、有效时长、画幅、声音和真实输入。人物图管身份，场景图管空间与光向，本镜起始帧管开场构图。实际参考顺序和提示词标签逐项对齐。Ref2VA 的参考输入与首尾帧模式各有自己的约束，以实际节点能力为准。
3. 按授权范围提交镜头，查询到完成后记录任务 ID 和可播放产物。超时时先查原任务状态。当前项目采用独立媒体适配器时，可用 [`short-drama-produce`](.agents/skills/short-drama-produce/SKILL.md) 按预览、确认、运行的流程生产，同一镜头的同一次任务选一个提交入口。

## 按需调用的技能

| 遇到的情况 | 技能与用法 |
| --- | --- |
| 有长篇原著或对标成片 | [`short-drama-novel-analyze`](.agents/skills/short-drama-novel-analyze/SKILL.md) 追溯原著章节、人物和事件，产出分集候选。 [`short-drama-breakdown`](.agents/skills/short-drama-breakdown/SKILL.md) 测对标剧的镜长、对白密度、开场和集尾。 |
| 中文说明或对白需要润色 | [`natural-zh-writing`](.agents/skills/natural-zh-writing/SKILL.md) 处理中文表达，保留作者语气、已确认对白和剧情事实。 |
| 双人戏站位难排，反打容易换边 | [`novel-staging`](.agents/skills/novel-staging/SKILL.md) 用结构化剧本和场景资料画开场俯视站位。 [`scene-asset`](.agents/skills/scene-asset/SKILL.md) 规划同一空间的主图和反打参考。 |
| 需要比较整场拍法 | [`ai-storyboard-director`](.agents/skills/ai-storyboard-director/SKILL.md) 比较调度、观看顺序与摄影方案。 [`cinematography`](.agents/skills/cinematography/SKILL.md) 细化景别、机位高度和焦距。 [`cinematic-audiovisual-language`](.agents/skills/cinematic-audiovisual-language/SKILL.md) 设计声音桥、信息揭示和剪辑节奏，也可用于拉片。 |
| 需要白模或交外部分镜表 | [`whitebox-previs-executor`](.agents/skills/whitebox-previs-executor/SKILL.md) 用 Blender 做实验性的机位和走位预演。 [`director-master`](.agents/skills/director-master/SKILL.md) 做导演定调、节奏规划和九列 XLSX 分镜表。 |
| H3 的挂图、对白、声音或续镜跑偏 | [`minimax-h3-prompt-writer`](.agents/skills/minimax-h3-prompt-writer/SKILL.md) 查参考用途、对白编排和不同运行入口的差异。最终提示词格式由官方 `h3-prompt-writing` 核对。 |
| 本地 H3 加载失败、显存不足或节点参数异常 | ComfyUI Agent Kit 的 [`minimax-h3`](.agents/skills/minimax-h3/SKILL.md) 查 H3 权重、节点和加速方案。 [`comfyui`](.agents/skills/comfyui/SKILL.md) 查工作流、API、队列和节点实际能力。 |
| 需要专项审查或固定字幕包装 | [`short-drama-review`](.agents/skills/short-drama-review/SKILL.md) 审当前剧本、资产、分镜、提示词或成片并列出具体修订项。 [`remotion-captions`](.agents/skills/remotion-captions/SKILL.md) 做可复用字幕样式和分页。 |
| 用其他模型做对照 | [`seedance-2-5-video-director`](.agents/skills/seedance-2-5-video-director/SKILL.md) 写 Seedance 2.5 提示词。 Agent Kit 的 [`seedance`](.agents/skills/seedance/SKILL.md) 查该模型入口和工作流， [`krea`](.agents/skills/krea/SKILL.md) 查 Krea 图像模型和节点。 |

## 可直接改写的调用示例

以下示例使用同一部虚构短剧。替换作品名、场次和镜号即可按阶段使用。

### 从点子到首集剧本

> 用 `$short-drama-develop` 把《门内来电》这个点子做成三集计划。夜班保安接到一通来自上锁房间的求救电话。每集写主角做了什么、发现了什么、结尾留下什么问题。确认分集后，用 `$short-drama-write` 写 EP001 的竖屏剧本，目标 60 秒，重点是保安如何确认声音来自门内。

### 从剧本到资产和可剪分镜

> 用 `$short-drama-assets` 拆 EP001-SC002 的人物、走廊和门锁状态。沿用已有角色定妆图，用 `$short-drama-image-prompts` 给缺失的门内反打图写提示词。用 `$short-drama-storyboard` 把这场戏拆成 4 镜，再用 `$shot-sequencing` 核对轴线和切点。每镜列出起始画面、动作终点和实际需要挂的参考图，缺图单列。

### 把一镜编译成 H3 提示词

> 用 `$h3-cinematic-director` 细化 SHOT-EP001-004。保安先听见门内的声音，右手靠近门把，在触碰前停住。用 `$h3-prompt-writing` 按目标 Toonflow 节点实际支持的 H3 模式写最终提示词。先核对角色图、走廊图和本镜起始参考的绑定顺序。对白保留原文，按实读时长给发声和反应分别留时间。这次先交提示词和挂图清单。

### 在 Toonflow 跑一条代表镜

> 用 `$toonflow` 核对工作机上已打开的作品、EP001 画布和 SHOT-EP001-004 节点。按已确认的提示词和参考输入，用该节点可用的 H3 快速预设生成 1 个 take，目标 5 秒、9:16、带声音。提交前核对实际参数。跟进到完成并回报任务 ID、生成片段的文件位置和实际时长。遇到超时先查原任务。

### 看两镜切点并修一次

> 用 `$continuity-checking` 对照 SHOT-EP001-003 的实际尾帧和 SHOT-EP001-004 的开头，检查站位、视线和右手状态。标出问题发生的时间和画面证据。若确认是起始站位偏了，用 `$h3-cinematic-director` 只改第 4 镜的起始参考，保留当前 take 供对照，给出补拍方案。

### 采用镜头并导出样片

> 用 `$short-drama-edit` 把 EP001-SC002 已选的 4 个 take 剪成一条 9:16 样片。先按实际媒体时间写入出点和剪辑单，保留门内声音跨过切点的效果，字幕按剧本对白核对。渲染后检查完整播放、声音、字幕和文件位置。

## 生成后怎么优化

先定位问题出在哪一层。剧本交代不清就改戏，构图读不到就改分镜或起始参考，只有生成执行偏差时再改提示词或工作流。

| 出片症状 | 优先检查和调整 |
| --- | --- |
| 台词被截断、说话人错了 | 先听实际音轨，标记开口、停顿、切点和尾部反应。用实读时长核对可发声窗口，再调整镜长、切镜或发声时机。提示词与声音输入疑点交 `minimax-h3-prompt-writer` 核对。 |
| 反打换边、动作或道具状态接不上 | 用 `continuity-checking` 比较上一镜实际尾部与本镜开头，再用 `shot-sequencing` 检查是否可以调整切点。需要重出时优先修正站位或起始参考，上一镜尾帧可作为续接依据，实际接法取决于节点模式。 |
| 角色漂移、动作没做到终点 | 核对挂图顺序和每张图的职责。用 `h3-cinematic-director` 写清触发、动作对象、接触过程和可见终点。重跑时先只改参考或动作描述中的一项。 |
| 排队慢、显存不足、任务状态不明 | 先查原任务和错误，再用 `minimax-h3` 或 `comfyui` 看当前权重、节点、规格和显存。用同一代表镜比较预设或分辨率，分别记录耗时和可用片段长度。 |

生成前可以把关键帧和临时对白排成粗剪，先看观众能否读到关键动作、对白是否放得下。每轮保留上一版 take，记录镜号、参考版本和顺序、预设、实际时长、任务 ID、改动项和采用区间。能在剪辑中解决的出入点和声音衔接，先试剪一版再决定是否补跑。连续多镜出问题时，先把代表镜和相邻切点跑通，再扩大到整场或整集。

## 上游来源

以下版本取自 2026-11-06 核对的上游默认分支最新提交。同名的 `short-drama-storyboard` 使用 Zenstory 当前版本。Toonflow 说明来自公开源码，操作时仍以部署版本暴露的 MCP 和节点参数为准。ComfyUI Agent Kit 使用上游 Codex 安装器指定的成品包目录。已提供的仓库级许可和声明保存在 [`.agents/licenses/`](.agents/licenses/)。

| 上游 | 固定提交 |
| --- | --- |
| HBAI-Ltd/Toonflow-app | [`6086cdffceb7`](https://github.com/HBAI-Ltd/Toonflow-app/commit/6086cdffceb704a632eca143dd16cd461a78cdac) |
| MRCalderon3D/everything-ai-filmmaking | [`8b2d04a301ee`](https://github.com/MRCalderon3D/everything-ai-filmmaking/commit/8b2d04a301eecb0699169b0d273004ea812e0135) |
| MiniMax-AI/MiniMax-H3 | [`199b7d0e1fd9`](https://github.com/MiniMax-AI/MiniMax-H3/commit/199b7d0e1fd95e7b3eafa8c15eca692534142427) |
| artificialguybr/minimax-h3-prompt-skill | [`5a8f69838228`](https://github.com/artificialguybr/minimax-h3-prompt-skill/commit/5a8f69838228cc979c4dd91e421656834bc4b8ea) |
| jtydhr88/ComfyTV | [`ea8e0cce7b1c`](https://github.com/jtydhr88/ComfyTV/commit/ea8e0cce7b1ca6e541f05c6b896e0c0f8a094a61) |
| snowfrost/skill-movie | [`69f6db670ecf`](https://github.com/snowfrost/skill-movie/commit/69f6db670ecf305e84f199e418bddbf2c1d988fe) |
| zenstory-ai/drama-skills | [`057fef2895db`](https://github.com/zenstory-ai/drama-skills/commit/057fef2895dbf1432bb5075a39141c02223a33f0) |
| eternityspring/shuohao-skills | [`5612d2a0bd5f`](https://github.com/eternityspring/shuohao-skills/commit/5612d2a0bd5f19d978c3ee19d1e42840335e3b4b) |
| liyue-aigc/seedance-2-5-video-director | [`ad0e68ba6ce2`](https://github.com/liyue-aigc/seedance-2-5-video-director/commit/ad0e68ba6ce24fb9ae9c67c9276061cef37663f1) |
| 62656456/ai-film-skills | [`5fda57408539`](https://github.com/62656456/ai-film-skills/commit/5fda5740853969c3dcb690b5b386dd1acc4c5f02) |
| Shanyin-ai/shanyin-director-master | [`30f0daecaf07`](https://github.com/Shanyin-ai/shanyin-director-master/commit/30f0daecaf0754e08cf88ece83fabf3a2372a016) |
| SlavaSexton/ComfyUI-Agent-Kit | [`0d259059b55b`](https://github.com/SlavaSexton/ComfyUI-Agent-Kit/commit/0d259059b55b0cc57ae45b232dbc03281621de35) |
| remotion-dev/skills | [`a2824c67f8b4`](https://github.com/remotion-dev/skills/commit/a2824c67f8b4585c294a8101db9f9f0ad3c643f8) |

## 在 Linux 上接入 Toonflow

把 Director 仓库放在 Toonflow 安装目录旁边。下面以 `~/WorkSpace/` 为例，`workspaces` 应指向 Toonflow 实例实际使用的工作区根目录。

```sh
git clone https://github.com/HATTER-LONG/Director.git "$HOME/WorkSpace/Director"
director="$HOME/WorkSpace/Director"
workspaces="$HOME/WorkSpace/toonflow/data/workspaces"

test -f "$director/AGENTS.md" && test -d "$director/.agents/skills" &&
  test -d "$workspaces" &&
  mkdir -p "$workspaces/.agents" &&
  ln -sT "$director/AGENTS.md" "$workspaces/AGENTS.md" &&
  ln -sT "$director/.agents/skills" "$workspaces/.agents/skills" &&
  touch "$workspaces/.director-toonflow-root"
```

如果 `workspaces/AGENTS.md` 或 `workspaces/.agents/skills` 已存在，先检查原有配置。指向同一份 Director 内容的链接可以沿用。有自己的规则或 skill 时，先合并再接入。

在 `~/.codex/config.toml` 的顶层加入工作区标记，已有 `project_root_markers` 时把新标记加到原列表中。

```toml
project_root_markers = [".git", ".director-toonflow-root"]
```

在 Toonflow 的「选择服务器工作目录」中创建并打开作品目录，再用 Codex 在同一个目录启动新会话。Codex 会加载共用的 `AGENTS.md`、发现项目技能，并读取作品目录自己的 `AGENTS.md`（如有）。更新 Director 仓库后，新会话会通过符号链接读取更新后的规则和技能。
