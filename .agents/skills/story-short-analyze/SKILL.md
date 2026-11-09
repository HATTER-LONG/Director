---
name: story-short-analyze
description: 只读拆解已有短故事和短篇小说的故事核、情绪变化、人物功能、反转线索与叙事手法，提炼带原文依据的可迁移机制。用于短篇文本分析；长篇改编用 short-drama-novel-analyze，成片拉片用 short-drama-breakdown，不修改源故事。
license: MIT
metadata:
  source: https://github.com/zenstory-ai/oh-story-claudecode
  upstream_commit: 31ea682045735f20302b7b3d38623ae3ee3571d6
  upstream_version: "3.1.0"
---
# story-short-analyze：短故事拆解

Director 适配版。先说明源文实际怎样运作，再提炼可以迁移的机制。只分析当前提供或可读取的原文，缺少全文时限定结论，不补造情节；源文不改写。

## 定位范围

沿用用户指定的作品、文本和分析问题。短篇完整分析与某段专项分析都可直接开始，不因统一字数阈值改换目标或增加确认。长篇改编材料交 [short-drama-novel-analyze](../short-drama-novel-analyze/SKILL.md)，视频成片交 [short-drama-breakdown](../short-drama-breakdown/SKILL.md)。

只要口头分析就直接回答；需要落盘时沿用现有分析文档。用户要求完整拆文库、结构化计数或中断续跑时，再使用 [输出契约](references/output-contract.md)，不是所有分析都生成五份文件。续跑已有授权任务直接接当前记录，保留旧结果；明确要重拆时再归档重做。

## 按问题读方法

先读 [分析方法](references/analysis-method.md)。其余只读本轮需要的项：

| 分析任务 | 参考 |
| --- | --- |
| 故事核、情节变化与情绪曲线 | [结构与情感线](references/stage2-3-structure-emotion.md) |
| 反转、人物、开头结尾与迁移 | [反转到综合评估](references/stage4-6-reversal-summary.md) |
| 题材承诺与钩子 | [题材标尺](references/analysis-short-genres.md)、[钩子](references/analysis-short-hooks.md) |
| 信息差、线索与证据链 | [悬疑](references/analysis-short-suspense.md) |
| 系统、重生或规则反复驱动 | [机制](references/analysis-short-mechanics.md) |
| 人物动机、对手、关系或感情线 | [人物](references/analysis-characters.md) |
| 已有源文的短板 | [故事质量](references/source-story-quality.md) |
| 分析报告的证据与措辞 | [报告表达](references/analysis-report-style.md)、[质量检查](references/quality-checklist.md) |

资料中的数量、比例与评分维度用于观察，不是源文合格线；源文没有的机制明确写“未出现”，不为填表编造。专项分析不强制走完整管道。

## 分析与交付

1. 用一句话概括故事核，按实际行动或信息变化分段，给出原文位置。
2. 说明每次情绪、人物选择和局面变化由什么触发；区分人物所知、读者所知和后来才揭露的事实。
3. 有反转时逐项对回铺垫、误导与兑现；没有时分析它靠什么完成情绪或关系变化，不替原文新增反转。
4. 结合实际问题检查对白、叙述视角、时间处理、角色功能及开头结尾，不只列形容词或评分。
5. 提炼能迁移的方法，同时写明成立条件、失败风险与不可照搬的人物、台词、独特物件及事件顺序。文本机制不能证明市场表现或作者意图。

报告只引用支撑判断所需的短片段，不复制整篇到交付中。分析师自己的中文表达可按 [natural-zh-writing](../natural-zh-writing/SKILL.md) 检查；不能把源文的语言特点悄悄改掉。用户要修原稿时再交 [story-deslop](../story-deslop/SKILL.md)，要写新故事时交 [story-short-write](../story-short-write/SKILL.md)，要做短剧改编时交 [short-drama-develop](../short-drama-develop/SKILL.md)。
