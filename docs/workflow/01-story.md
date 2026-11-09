# 01 故事构建

本页是 [标准 AI 视频](modes/standard-ai-video.md) 的详细阶段；[叙事动画](modes/illustrated-narration.md) 按自己的步骤推进，只在需要本页专项方法时读取对应部分。

用户提供一句话点子、梗概、题材或原著，想确定短剧讲什么时，读本页。已有方向的项目直接进入[分集规划](02-episodes.md)。

## 使用 Skill

- [short-drama-develop](../../.agents/skills/short-drama-develop/SKILL.md) 负责创作简报和故事引擎。先读它的故事开发参考。
- 长篇改编先用 [short-drama-novel-analyze](../../.agents/skills/short-drama-novel-analyze/SKILL.md) 找关键章节、人物和剧情单元。需要创建项目时用 [short-drama](../../.agents/skills/short-drama/SKILL.md) 核对配置与目录。
- 需要先写完整短故事时用 [story-short-write](../../.agents/skills/story-short-write/SKILL.md) ＋ story-deslop ＋ natural-zh-writing；已有短篇只需分析时用 [story-short-analyze](../../.agents/skills/story-short-analyze/SKILL.md)。分析不自动进入开发；进入制作时按已选模式交接。已有材料足够时无需补做故事稿或分析。

## 操作

1. 从输入提取已定的题材、人物、画幅、制作形态和规模。把尚未决定的事项单独列出。已有作品沿用当前配置。
2. 写清谁想达成什么、谁或什么阻止他、失败要付什么代价。给主角一个能拍出来的选择，让这个选择改变局面。
3. 写出故事引擎。说明冲突怎样反复出现并升级，人物或关系怎样随之变化。只有不同方向会实质改变故事时，才给出候选及取舍。
4. 核对人物、事件和结局等已确认内容。改编时标出关键判断对应的原著位置。

## 交付

交付创作简报与故事引擎。有落盘要求时沿用作品已有文档。采用 `short-drama` 布局的新项目可用 `项目开发/creative-brief.md` 和 `项目开发/story-engine.md`。将选定方向、创作限制和待决定事项交给分集阶段。
