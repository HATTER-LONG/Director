# Oh Story 来源与 Director 适配

- 来源：https://github.com/zenstory-ai/oh-story-claudecode
- 固定提交：`31ea682045735f20302b7b3d38623ae3ee3571d6`（2026-11-09 核对）。
- 安装范围：`story-deslop`、`story-short-write`、`story-short-analyze`，位于 `.agents/skills/`；许可见同目录 LICENSE。
- 原始版本分别为 1.0.0、1.0.0、3.1.0。三个 SKILL 入口按 Director 适配，版本信息移入 metadata，保留上游方法资料与随附脚本。
- 本地调整：去味区分表达、用笔、因果并关联 natural-zh-writing；剧情修改回原阶段负责人；短篇写作与拆解支持既有作品和局部任务，不强制建立另一套小说工程。
- 默认不部署 story-setup、agents、hooks、Dashboard、作者记忆或发布流程。按当前任务授权执行，不沿用上游的强制 spawn、反复读取／确认、平台配额或脚本命中清零要求。
- `story-deslop/references/style-resolution.md` 适配现有文风来源与实际白名单读取位置；`story-short-write/references/workflow-revision.md` 统一交给 story-deslop 精修，不默认整份文件改标点。随附脚本未修改，不代表已适配剧本格式。
- 后续更新先对比上述固定提交和本地适配，不能用上游入口覆盖 Director 的文档职责与现行授权范围。
