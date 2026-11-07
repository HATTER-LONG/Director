# Director

Director 用于制作 AI 短剧、漫剧和叙事短片。按用户指定阶段完成创作、素材、分镜、提示词或制作记录，沿用当前作品和已确认事实。发现关键冲突时说明具体影响，暂停受影响部分，继续能独立完成的工作。

## 从这里开始

1. 确认作品目录、本轮交付和用户最新要求；已有成果从当前阶段继续，不补造未请求的阶段。
2. 按下表读取一个对应 workflow，再读该阶段的负责技能。跨阶段按实际顺序读取，不预加载全部技能。
3. 只在遇到具体问题时补读专项资料。已完整读过且未变的材料可复用；局部修订只补读受影响上下文。
4. 完成后检查来源、引用和实际交付是否一致。生成、检查可用、创作者采用分别记录。

没有自动加载 AGENTS 或技能功能的模型，也按上述路径手动读文件。技能名只是文件入口，不依赖某个模型的专有调用语法。通过符号链接加载时，先用 `realpath` 找到本文件源目录，再解析下列相对链接。缺少生成工具时先完成已授权的文稿和输入准备，明确未执行的操作，不声称已生成。

## 制作文档入口

编号文件表示制作阶段；`references/` 中的资料由各阶段按条件引用，不是后续步骤，也不要求开始时全部读取。

| 当前要做什么 | 先读 |
| --- | --- |
| 从点子、梗概或原著确定故事方向 | [01 故事构建](docs/workflow/01-story.md) |
| 把故事拆成连续的几集 | [02 分集规划](docs/workflow/02-episodes.md) |
| 写或改单集剧本 | [03 单集剧本](docs/workflow/03-screenplay.md) |
| 定人物、造型、场景、道具与声音方向 | [04 视觉设定](docs/workflow/04-visual-assets.md) |
| 写图片提示词、生成或修订参考素材 | [05 图片与参考素材](docs/workflow/05-image-references.md) |
| 拆镜、排镜序、按需补关键帧 | [06 分镜与镜序](docs/workflow/06-storyboard.md) |
| 为已定镜头写 H3 提示词 | [07 H3 视频提示词](docs/workflow/07-h3-prompts.md) |
| 在 Toonflow 提交 H3 并收回视频 | [08 Toonflow 视频生成](docs/workflow/08-toonflow-generation.md) |
| 检查视频、选 take 或定位返工 | [09 视频验收与返工](docs/workflow/09-video-review.md) |
| 剪辑、字幕、声音处理与导出 | [short-drama-edit](.agents/skills/short-drama-edit/SKILL.md) |
| 初始化项目、恢复进度或打开 Dashboard | [short-drama](.agents/skills/short-drama/SKILL.md) |

## 文档职责与规则来源

| 位置 | 维护内容 |
| --- | --- |
| `README.md` | 项目介绍、安装、使用示例；不另立制作规则 |
| 本文件 | 全局边界、规则优先级与任务入口 |
| `docs/workflow/01–09` | 按制作阶段说明输入、步骤、检查与交接 |
| `docs/workflow/references/` | 多阶段共用的生产原则、授权、部署能力与排查资料；按阶段链接读取 |
| 阶段 `short-drama-*` 技能 | 创作方法与当前阶段文档 |
| 摄影、场景、调度等专项技能 | 针对问题补设计或检查结论，回填负责阶段 |
| 模型格式与部署资料 | 提示词语法、项目差异、当前运行能力，分别维护 |
| 作品目录 | 剧情事实、采用素材、版本、任务与验收记录 |

用户当前要求和既有授权优先于文档默认值。Director 项目规则优先于技能的通用建议；模型格式应用项目差异，执行能力以已核实的实际入口为准。文档与运行证据冲突时记录差异，不用提示词假装存在缺失端口，也不静默改变创作目标。

每项事实只在负责文档修改，再同步下游引用，具体见 [变更传播](docs/workflow/references/production-principles.md#来源改变后更新哪些地方)。专项技能和派生 JSON 不建立另一套创作事实。已有作品沿用目录、编号和格式；只有使用五文档检查器时，才按 [交接格式](.agents/skills/short-drama/references/creator-documents.md) 填写其精确字段。

## 生产与素材交接

入口、授权范围、批次与恢复统一按 [生产路由与授权](docs/workflow/references/production-routing.md)。已明确授权的范围持续有效；必要输入缺失或超出范围时才暂停相关提交。

跨阶段制作读 [通用生产原则](docs/workflow/references/production-principles.md)。环境和声音素材的生产次序、证据与检查按 [05 图片与参考素材](docs/workflow/05-image-references.md)；素材画布与镜头画布的分工按 [08 素材交接](docs/workflow/08-toonflow-generation.md#素材交接与镜头画布)。这些流程优先于专项技能的通用出图建议，用户指定复用原画布或限制生成范围时按其要求执行。

## H3 提示词项目规则

默认完整参考加动作描述，不要求每镜生成首尾帧；跨段先设计可剪接的镜头。具体职责如下，不在各技能重复维护参数与语法：

- [h3-prompt-writing](.agents/skills/h3-prompt-writing/SKILL.md) 维护格式入口，按实际模式选官方指南。
- [Director profile](.agents/skills/h3-prompt-writing/references/director-profile.md) 维护切镜时序、语言、对白结束符和校验约定，优先于上游默认值；官方指南保留为快照。
- [本地模型能力](docs/workflow/references/local-model-capabilities.md) 维护当前模式、参考限制、接续片段和运行参数，不能套用其他入口的能力。

只改提示词的局部文字时，读取当前版本、受影响上下文和格式规则即可，不重开导演方案或模型选型。按问题选技能和完成交接见 [07](docs/workflow/07-h3-prompts.md)。

## 项目目录与工作环境

共用规则在 `/home/layton/WorkSpace/Director/`，作品通常在 `/home/layton/WorkSpace/toonflow/data/workspaces/<项目名>/`。Toonflow 返回的实际路径为准。共用 AGENTS 和技能通过符号链接接入工作区，安装方法见 [README](README.md#在-linux-上接入-toonflow)。切换作品时重新确认 Agent 与 Toonflow 指向同一目录，并读取作品自己的 AGENTS（如有）。

| 组件 | 入口 |
| --- | --- |
| CachyOS 工作机 | `ssh layton@cachyos.home.arpa`，RTX 5070 Ti，16 GB 显存 |
| Toonflow 网页 | 工作机上 `http://127.0.0.1:3000/`；其他机器按下方转发后访问 `http://127.0.0.1:13000/` |
| Toonflow MCP | `http://cachyos.home.arpa:3000/mcp`，使用已授权凭据 |
| ComfyUI | `http://cachyos.home.arpa:8189`；操作前读工作机 `/home/layton/WorkSpace/ComfyUI-clean/AGENTS.md` |

```sh
ssh -o ExitOnForwardFailure=yes -N -L 127.0.0.1:13000:127.0.0.1:3000 layton@cachyos.home.arpa
```

操作 Toonflow 前按 [toonflow](.agents/skills/toonflow/SKILL.md) 读取 `getAppState`，核对连接、目录、画布和节点能力；切换或重连后重新定位。画布、节点和其中已打开的文档通过 MCP 修改。配置供应商、模型或插件前查询 `listAppOperations`；凭据放在 Director 之外。仅当用户明确要求委托 Toonflow 内置 Agent 时调用 `runAgent`。

## 共用经验与中文表达

workflow 只收跨作品可复用的条件、证据、处理方法与验收要求。具体剧名、人物、镜号、提示词、样片时间点和采用结论留在作品记录。未经验证的判断标为待验证，不能写成模型保证。更新共用文档前检查换一个作品是否仍适用。

默认简体中文。按阶段技能完成创作，再用 [natural-zh-writing](.agents/skills/natural-zh-writing/SKILL.md) 检查表达。保留事实、条件、判断强度、角色口吻和已确认对白；提示词字段、标签、参考顺序与时间约束遵守实际模型格式。
