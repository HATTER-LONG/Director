# Director

Director 提供 AI 短剧、漫剧和叙事短片的共用制作流程与技能，默认通过 Toonflow 生成素材和视频。支持从故事、剧本、素材、分镜、提示词或剪辑任一已有阶段继续。

## 快速开始

1. 打开作品目录，读取 [AGENTS.md](AGENTS.md)。它是任务入口和规则索引。
2. 说明本轮目标，例如“修改 EP002 的对白并同步分镜和提示词”，或“按现有素材生成一个预览 take”。
3. 按 AGENTS 的阶段表读取对应 workflow 和负责技能。只有具体问题需要时才补读摄影、调度或模型排障资料。

已有 Toonflow 项目沿用当前文档、镜号和画布，不必迁移目录或新建配置。没有技能自动发现功能的模型可直接打开 `.agents/skills/<技能名>/SKILL.md`；`$技能名` 是调用提示，不是执行这些文档的必要条件。

## 常用任务示例

| 任务 | 请求示例 |
| --- | --- |
| 故事与分集 | 把《门内来电》的梗概发展成三集计划，说明每集局面怎样变化、下一集接什么。 |
| 剧本修订 | 优化 EP001 的行动因果与对白，保留已确认设定，并同步受影响的分镜和提示词。 |
| 参考素材 | 为 EP001 补场景多机位素材，按素材流程检查布局、选帧和优化图，保留生成记录。 |
| H3 提示词 | 为 SHOT-EP001-004 编译 H3 提示词，保留对白，列出实际参考顺序，本轮只交文稿。 |
| 生成预览 | 用现有 Toonflow 节点生成 SHOT-EP001-004 的一个预览 take，跟进输出并检查关键动作和对白。 |
| 剪辑导出 | 将 EP001 已选镜头剪成样片，核对声音、字幕、切点与实际片长。 |

请求中说明作品、范围、交付物与生成限制即可；模型应沿用已有设定和授权，必要的制作选择由对应阶段处理。完整阶段路由见 [AGENTS](AGENTS.md#制作文档入口)。

## 文档怎么维护

`docs/workflow/` 顶层保留编号阶段流程，`docs/workflow/references/` 存放跨阶段共用资料。先读当前阶段，再按其中链接查所需规则。

- 文档分工与优先级见 [AGENTS](AGENTS.md#文档职责与规则来源)。同一规则保留一个维护来源，其他入口用简短提醒和链接。
- 通用经验按“条件、证据、处理与验收”写入 workflow；具体作品记录留在作品目录。
- 技能只保留一个维护源，全局与项目目录不维护分叉副本。上游版本是来源基线，本仓库包含 Director 调整。
- 更新技能后检查入口描述、受影响引用和示例；使用五文档解析器或模型校验器时，核对文档格式与工具行为一致。

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
| 62656456/ai-film-skills | [`5fda57408539`](https://github.com/62656456/ai-film-skills/commit/5fda5740853969c3dcb690b5b386dd1acc4c5f02) |
| SlavaSexton/ComfyUI-Agent-Kit | [`0d259059b55b`](https://github.com/SlavaSexton/ComfyUI-Agent-Kit/commit/0d259059b55b0cc57ae45b232dbc03281621de35) |

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
