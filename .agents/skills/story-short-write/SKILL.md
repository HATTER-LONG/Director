---
name: story-short-write
description: 构思、编写或修订完整短故事和短篇小说，处理人物诉求、情绪推进、反转铺垫与兑现。用于写短故事或为改编准备故事稿；可拍摄剧本仍由 short-drama-write 维护，不自动套用网文付费点和字数模板。
license: MIT
metadata:
  source: https://github.com/zenstory-ai/oh-story-claudecode
  upstream_commit: 31ea682045735f20302b7b3d38623ae3ee3571d6
  upstream_version: "1.0.0"
---
# story-short-write：短故事创作

Director 适配版。利用上游短篇写作资料完成本轮所需的构思、故事稿或修订；当前项目的事实、范围和格式优先。直接读取现有材料，不要求另建小说工程、安装 story-setup 或先跑扫榜。

## 先确定交付

- 用户要故事或小说：本技能负责故事设计与正文，沿用现有目录与文件。新故事没有文件约定时，按需保留故事稿及必要设定，不为一个短段建立整套追踪系统。
- 用户要短剧剧本：由 [short-drama-write](../short-drama-write/SKILL.md) 维护场次、动作和对白，本技能只补当前所需的故事设计方法；不另写平行剧本。
- 用户要系列方向或分集：由 [short-drama-develop](../short-drama-develop/SKILL.md) 维护简报、故事引擎与分集。
- 用户只要去味：转 [story-deslop](../story-deslop/SKILL.md)，不重开故事设计。

从当前要求和原文确定题材、人物、目标体验、视角、篇幅与结尾义务。已有选择直接沿用；只有缺失项会实质改变结果时才问，不把固定情绪问卷或重新确认当成写作门槛。没有反转需求就不硬造反转。

创作或改写故事稿按 [AGENTS 组合](../../../AGENTS.md#制作文档入口) 同时加载本技能、[story-deslop](../story-deslop/SKILL.md) 与 [natural-zh-writing](../natural-zh-writing/SKILL.md)：本技能写稿，后两者依次检查叙事和词句；检查范围限于本轮稿件，不各写一版。只分析或只保留原文排版不因此改稿。

## 按需读取

资料中的第一人称、情绪强度、付费点、字数与钩子频率是网文语境下的建议，只在作品采用相应体裁与目标时使用。方法资料不扩大授权，不覆盖当前阶段格式；不因某份资料列出整套清单而加载全部引用。

| 当前问题 | 读取 |
| --- | --- |
| 故事主线与短篇推进 | [短篇手艺](references/short-craft.md)，按本题材使用，不自动引入虐爽设定 |
| 反转如何铺垫、误导与兑现 | [短篇反转](references/short-reversal.md) |
| 情绪拉扯、关系变化或余韵 | [情绪方法](references/emotional-methods.md) 的相关部分 |
| 场景重心、冲突重复或详略 | [场景手艺](references/scene-craft.md) |
| 对话中的诉求、策略和权力变化 | [对白手艺](references/dialogue-mastery.md) 按其问题索引读取 |
| 对手动机或揭露顺序 | [反派与揭露](references/villain-and-reveal.md) |
| 已确定题材，需要具体写法 | 从 [题材包](references/genre-styles/) 选择匹配项；无匹配时按已有故事设计继续，可参考 [题材公式](references/genre-writing-formulas.md)，不强行归类 |
| 明确制作平台付费短篇 | 按需读 [投稿手艺](references/submission-craft.md)、[小节钩子](references/hooks-chapter.md) 与 [短篇格式](references/short-format.md) |

## 写作与修订

1. 明确人物当下要什么、为什么此刻行动、受到什么限制，以及故事将兑现什么。人物动机和解决依据来自已定设计，不能靠临时出现的资源收尾。
2. 按因果组织几个必要的变化：行动、反馈、新判断、关系变化或结果。一个核心问题可由多种情绪承载；不强求每段都有反转，也不为对齐小节长度加阻碍。
3. 关键交锋和选择写足，次要流程压缩到能看懂。对白、叙述、心理各尽其用，生活细节与停顿可以保留，不把每句话都改成信息播报。
4. 反转型回查线索与揭露时机；无反转型检查关系、认知或情绪如何抵达结尾。已有事实、原文引语与作者指定的片段按要求保留。
5. 完成当前范围后，按 [精修交接](references/workflow-revision.md) 自查并调用 story-deslop 处理实际问题；natural-zh-writing 只补必要的中文表达检查。

故事的设计选择写回原文件，后续阶段读取同一来源。小说字数要求与视频时长分别核对；故事改成影片后，时长按表演、动作、停顿及实际配音重估，不把小说字数换算成固定镜长。

## 交付

交付当前任务要求的完整故事、构思或修订稿，简要说明关键变化和仍未决定的事项。已获授权的写作与修复持续完成，不要求每个阶段重新确认或换会话。进入视频制作时按 [已选模式](../../../AGENTS.md#先确定制作模式) 交接：标准模式进入所需开发或剧本阶段，叙事动画直接整理声音脚本；只写故事不自动生成分镜和媒体。

保留的上游工作流与脚本供明确采用其小说工程时参考，不自动部署 agents、hooks、作者记忆或 Dashboard，也不直接运行其全文件标点写回与硬编码小说契约检查。
