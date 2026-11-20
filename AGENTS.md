# Director

Director 用于制作 AI 短剧、漫剧和叙事短片。按用户指定阶段完成创作、素材、分镜、提示词或制作记录，沿用当前作品和已确认事实。发现关键冲突时说明具体影响，暂停受影响部分，继续能独立完成的工作。

## 从这里开始

1. 确认作品目录、本轮交付、已有制作模式和用户最新要求；已有成果从当前步骤继续，不补造未请求的阶段。长任务恢复先读已有制作记录中的 [续作摘要](docs/workflow/references/production-principles.md#让生产过程可恢复)，再核对当前来源。
2. 先选下方制作模式，只读该模式的当前步骤，再按任务加载技能组合。一个任务可能需要多个技能，按职责共同完成；跨步骤按实际顺序加载，不预读另一模式的整套流程。
3. 按当前对象读取适用的操作规范，再按具体问题补读专项资料。人物设定图的提示词、生成与验收必须读取 [人物参考](docs/workflow/references/character-references.md)，不能把已有项目规格当成出错后才查的排障资料。已完整读过且未变的材料可复用；局部修订只补读受影响上下文。
4. 完成后检查来源、引用和实际交付是否一致。生成、检查可用、创作者采用分别记录。

没有自动加载 AGENTS 或技能功能的模型，也按上述路径手动读文件。技能名只是文件入口，不依赖某个模型的专有调用语法。通过符号链接加载时，先用 `realpath` 找到本文件源目录，再解析下列相对链接。缺少生成工具时先完成已授权的文稿和输入准备，明确未执行的操作，不声称已生成。

## 先确定制作模式

| 制作模式 | 如何判断与读取 | 制作逻辑 |
| --- | --- | --- |
| [标准 AI 视频](docs/workflow/modes/standard-ai-video.md) | 依靠场景内的人物表演、动作与镜头关系叙事；从该页定位当前阶段，再读需要的编号 workflow | 剧本 → 人物与空间设定 → 参考素材与分镜 → 视频生成与验收 → 剪辑 |
| [叙事动画](docs/workflow/modes/illustrated-narration.md) | 以讲述推进故事，旁白默认配静图与轻量后期动画，生成动态镜头作为备选；直接按该页步骤读技能与共用资料 | 声音脚本 → 声画分工与最小素材 → 配音定时 → 插画（按需选用动态片段）→ 字幕、动画与剪辑 |

制作模式与写实、漫画、二维、三维等画风分开记录。沿用作品已选模式；用户已明确“配音＋插画＋少量动画”即可进入叙事动画，不再询问。仅有画风标签而制作方式会影响当前决策时才澄清；只改一段文字或一个提示词时先完成该局部任务，不为选模式阻断工作。

在现有制作记录或视觉设定中记下模式、采用范围、声音分工和必要例外，不新增强制配置文件。混合作品按段落注明范围；某段需要完整空间，只为该段补读标准场景与分镜方法，完成后返回原路线。叙事动画中用到 H3 的段落复用 07–09，纯静图和后期动画跳过它们；标准 AI 视频有一段旁白也不自动改成另一模式。

## 制作文档入口

模式 workflow 决定步骤、输入和交付；本表统一任务所需的技能组合。`＋` 表示一起加载并按分工执行，“再加”只在条件成立时加载。已完整读过且未变的内容可复用，补读只覆盖当前问题。组合加载不等于多个技能各写一版，也不递归重启已经完成的检查。

| 当前任务 | 基本 Skill 组合 | 条件补充与交接 |
| --- | --- | --- |
| 确定故事方向或规划分集 | [short-drama-develop](.agents/skills/short-drama-develop/SKILL.md) | 需要长篇原著依据再加 [short-drama-novel-analyze](.agents/skills/short-drama-novel-analyze/SKILL.md)；只分析原著不加载开发，不强制给单条叙事动画做分集 |
| 写改剧本、对白或旁白 | [short-drama-write](.agents/skills/short-drama-write/SKILL.md) ＋ [story-deslop](.agents/skills/story-deslop/SKILL.md) ＋ [natural-zh-writing](.agents/skills/natural-zh-writing/SKILL.md) | 按当前模式保留声音分工；叙述脚本不强制改成全场景表演 |
| 写完整短故事或改编前故事稿 | [story-short-write](.agents/skills/story-short-write/SKILL.md) ＋ story-deslop ＋ natural-zh-writing | 文学稿与制作剧本区分；进入制作时按所选模式交接 |
| 分析已有短篇／长篇／对标成片 | 分别选 [story-short-analyze](.agents/skills/story-short-analyze/SKILL.md)、short-drama-novel-analyze 或 [short-drama-breakdown](.agents/skills/short-drama-breakdown/SKILL.md) | 按输入和任务选一个分析负责人；分析不自动改稿或创建制作项目 |
| 定人物、造型、背景、道具与声音方向 | [short-drama-assets](.agents/skills/short-drama-assets/SKILL.md) | 空间、美术或多机位需要设计再加 [scene-asset](.agents/skills/scene-asset/SKILL.md)；简洁背景不默认建设完整房间 |
| 写资产图／镜头关键帧提示词 | 资产图用 [short-drama-image-prompts](.agents/skills/short-drama-image-prompts/SKILL.md)；本镜关键帧用 [short-drama-storyboard](.agents/skills/short-drama-storyboard/SKILL.md) | 按图片用途选择负责人；实际生成加 [toonflow](.agents/skills/toonflow/SKILL.md)，只写提示词不提交 |
| 做分镜或声画表、排镜序 | short-drama-storyboard；多镜场次或需要专门设计接镜时加 [shot-sequencing](.agents/skills/shot-sequencing/SKILL.md) | 叙事动画同时拆最小素材时加 short-drama-assets；纯静图排版不强加空间调度检查 |
| 比较拍法或解决摄影、声画、复杂站位问题 | short-drama-storyboard ＋ 对应专项技能 | 分别按问题选 [ai-storyboard-director](.agents/skills/ai-storyboard-director/SKILL.md)、[cinematography](.agents/skills/cinematography/SKILL.md)、[cinematic-audiovisual-language](.agents/skills/cinematic-audiovisual-language/SKILL.md)、[novel-staging](.agents/skills/novel-staging/SKILL.md)；不预加载全部，结论回同一分镜 |
| 写改 H3 提示词 | [short-drama-video-prompts](.agents/skills/short-drama-video-prompts/SKILL.md) ＋ [h3-prompt-writing](.agents/skills/h3-prompt-writing/SKILL.md) | 按 [07](docs/workflow/07-h3-prompts.md) 分文档维护与格式编译；设计改变先用 short-drama-storyboard ＋ [h3-cinematic-director](.agents/skills/h3-cinematic-director/SKILL.md) 更新分镜 |
| 操作画布、节点或提交已有文稿 | toonflow | H3 执行读 [08](docs/workflow/08-toonflow-generation.md)，需写改提示词才加上一行组合；TTS 等媒体按所选模式与实际节点执行 |
| H3 参考、对白、声线或接续异常 | [minimax-h3-prompt-writer](.agents/skills/minimax-h3-prompt-writer/SKILL.md) | 先诊断；要改提示词再加编写组合，要改设计回分镜；不靠诊断技能另立格式 |
| 本地模型、节点与工作流操作或排障 | 实际操作 ComfyUI 用 [comfyui](.agents/skills/comfyui/SKILL.md)；H3 部署问题加 [minimax-h3](.agents/skills/minimax-h3/SKILL.md) | 需要同步 Toonflow 配置或连线再加 toonflow；普通文本编写不加载运行技能 |
| 检查视频、选 take 或定位返工 | [continuity-checking](.agents/skills/continuity-checking/SKILL.md)；检查接镜再加 shot-sequencing | 读 [09](docs/workflow/09-video-review.md)，按实际问题回设计、编译或运行；不把检查范围自动扩大为修改 |
| 审查故事、剧本或成片 | [short-drama-review](.agents/skills/short-drama-review/SKILL.md) | 叙事去味审查加 story-deslop，只诊断；实际视频的连续性与接镜专项按上一行补读 |
| 配音定时、字幕、动画、剪辑和导出 | [short-drama-edit](.agents/skills/short-drama-edit/SKILL.md) | TTS／ASR 时间处理读 [配音与时间对齐](docs/workflow/references/voice-and-timing.md)；重排镜序再加 shot-sequencing；用 Remotion 时加环境中可用的 remotion-best-practices，再按其路由读创建、动画、字幕或渲染资料 |
| 初始化项目、恢复进度或打开 Dashboard | [short-drama](.agents/skills/short-drama/SKILL.md) | 定位制作模式和当前步骤，再加载实际任务组合；五文档是可选组织方式，不是两种模式共同的必经流水线 |

剧本、对白、旁白和故事稿的创作／改写默认包含去 AI 味检查，无需用户另说“去 AI 味”：先由写作技能完成内容，交稿前用 story-deslop 检查本轮文本的因果、详略和角色声口，再用 natural-zh-writing 的相关条目检查句法、用词与冗余。三个技能共同处理同一份稿件，不各自重写一遍；局部修改只检查改动及必要上下文。只做原文保留、格式规范化、台词搬运或提示词编译时，不因此获得改写已确认正文的授权。

## 文档职责与规则来源

| 位置 | 维护内容 |
| --- | --- |
| `README.md` | 项目介绍、安装、使用示例；不另立制作规则 |
| 本文件 | 全局边界、规则优先级与任务入口 |
| `docs/workflow/modes/` | 两种模式各自的制作步骤、读取顺序与模式专用经验 |
| `docs/workflow/01–06` | 标准 AI 视频的详细创作与素材阶段；另一模式按具体问题引用局部方法 |
| `docs/workflow/07–09` | 两种模式中实际 H3 段落共用的编译、生成与验收步骤 |
| `docs/workflow/references/` | 多阶段共用的生产原则、授权、部署能力与排查资料；按阶段链接读取 |
| 阶段 `short-drama-*` 技能 | 创作方法与当前阶段文档 |
| 摄影、场景、调度等专项技能 | 针对问题补设计或检查结论，回填负责阶段 |
| 模型格式与部署资料 | 提示词语法、项目差异、当前运行能力，分别维护 |
| 作品目录 | 剧情事实、采用素材、版本、任务与验收记录 |

用户当前要求和既有授权优先于文档默认值。Director 项目规则优先于技能的通用建议；模型格式应用项目差异，执行能力以已核实的实际入口为准。文档与运行证据冲突时记录差异，不用提示词假装存在缺失端口，也不静默改变创作目标。

每项事实只在负责文档修改，再同步下游引用，具体见 [变更传播](docs/workflow/references/production-principles.md#来源改变后更新哪些地方)。专项技能和派生 JSON 不建立另一套创作事实。已有作品沿用目录、编号和格式；只有使用五文档检查器时，才按 [交接格式](.agents/skills/short-drama/references/creator-documents.md) 填写其精确字段。

## 生产与素材交接

入口、授权范围、批次与恢复统一按 [生产路由与授权](docs/workflow/references/production-routing.md)。已明确授权的范围持续有效；必要输入缺失或超出范围时才暂停相关提交。

跨阶段制作读 [通用生产原则](docs/workflow/references/production-principles.md)。制作次序按已选模式；完整空间资产的生产才读 [05 场景流程](docs/workflow/05-image-references.md#场景素材生成)。素材版本、检查状态与画布分工统一按 [素材交接](docs/workflow/references/media-handoff.md)，涉及 TTS 或字幕时间再读 [配音与时间对齐](docs/workflow/references/voice-and-timing.md)。这些流程优先于专项技能的通用出图建议，用户指定复用原画布或限制生成范围时按其要求执行。

## H3 提示词项目规则

对实际采用 H3 的段落，默认完整参考加动作描述，不要求每镜生成首尾帧；跨段先设计可剪接的镜头。具体职责如下，不在各技能重复维护参数与语法：

- [h3-prompt-writing](.agents/skills/h3-prompt-writing/SKILL.md) 维护格式入口，按实际模式选官方指南；其 [内容取舍与多轮修订](.agents/skills/h3-prompt-writing/references/prompt-composition.md) 统一维护内容主次、异常控制篇幅和整段重写方法，新写与返工都应用。
- [Director profile](.agents/skills/h3-prompt-writing/references/director-profile.md) 维护切镜时序、语言、对白结束符和校验约定，优先于上游默认值；官方指南保留为快照。
- [本地模型能力](docs/workflow/references/local-model-capabilities.md) 维护当前模式、参考限制、接续片段和运行参数，不能套用其他入口的能力。

只改提示词的局部文字时，读取当前版本、受影响上下文和格式规则即可，不重开导演方案或模型选型。按问题选技能和完成交接见 [07](docs/workflow/07-h3-prompts.md)。

## 项目目录与工作环境

共用规则在 `/home/layton/WorkSpace/Director/`，作品通常在 `/home/layton/WorkSpace/toonflow/data/workspaces/<项目名>/`。Toonflow 返回的实际路径为准。共用 AGENTS 和技能通过符号链接接入工作区，安装方法见 [README](README.md#在-linux-上接入-toonflow)。切换作品时重新确认 Agent 与 Toonflow 指向同一目录，并读取作品自己的 AGENTS（如有）。

| 组件 | 入口 |
| --- | --- |
| CachyOS 工作机 | `ssh layton@cachyos.home.arpa`，RTX 5070 Ti，16 GB 显存 |
| Toonflow 网页 | 工作机上 `http://127.0.0.1:3000/`；其他机器按下方转发后访问 `http://127.0.0.1:13000/` |
| Toonflow MCP | 工作机本地 `http://127.0.0.1:10588/mcp`；其他机器使用 `http://cachyos.home.arpa:3000/mcp`，均使用已授权凭据。端口以当前 MCP 设置为准 |
| ComfyUI | `http://cachyos.home.arpa:8189`；操作前读工作机 `/home/layton/WorkSpace/ComfyUI-clean/AGENTS.md` |
| Hugging Face 模型下载 | 调用 `/home/layton/WorkSpace/hfd.sh` 时显式设置 `HF_ENDPOINT=https://hf-mirror.com`。用 `--include` 筛选所需权重和配套文件，用 `--local-dir` 指定模型保存目录 |

```sh
ssh -o ExitOnForwardFailure=yes -N -L 127.0.0.1:13000:127.0.0.1:3000 layton@cachyos.home.arpa
```

操作 Toonflow 前按 [toonflow](.agents/skills/toonflow/SKILL.md) 读取 `getAppState`，核对连接、目录、画布和节点能力；切换或重连后重新定位。画布、节点和其中已打开的文档通过 MCP 修改。配置供应商、模型或插件前查询 `listAppOperations`；凭据放在 Director 之外。仅当用户明确要求委托 Toonflow 内置 Agent 时调用 `runAgent`。

## 共用经验与中文表达

模式专用的步骤与取舍留在对应 mode workflow；只有跨模式成立的方法才进入共用 references 或技能。workflow 与技能只收跨作品可复用的条件、证据、处理方法与验收要求。具体剧名、人物、镜号、提示词、样片时间点和采用结论留在作品记录。未经验证的判断标为待验证，不能写成模型保证。更新共用文档前检查换一个作品是否仍适用；按 [经验迭代](docs/workflow/references/production-principles.md#经验如何进入共用规则) 修订已有条目和调用入口，不逐轮叠加永久限制。

默认简体中文。叙事创作按 [任务组合](#制作文档入口) 完成写作、去味与表达检查。普通说明、邮件和文案的中文优化直接用 natural-zh-writing。可拍摄剧本仍由 short-drama-write 维护，不自动部署另一套小说工程。

保留事实、条件、判断强度、角色口吻和已确认对白；提示词字段、标签、参考顺序与时间约束遵守实际模型格式。检测脚本的命中需回原文判断，不当作作者身份判定或机械删改指令。
