---
name: short-drama-image-prompts
description: 为短剧人物、造型、地点、道具和状态编写或修改可直接复制的图片提示词 Markdown。用户提到角色设定图、三视图、参考图、场景板、道具图、风格帧、Look Development、状态变体或局部编辑提示词时使用；不生成图片，也不调用供应商。
license: MIT
---

# 短剧资产图片提示词

把视觉事实写成可复用、可修改的图片提示词，沿用作品现有文档。使用五文档格式时写入 `剧集/<EP>/图片提示词.md`，IMG 标题、REF 输入和可复制正文格式统一见 [交接格式](../short-drama/references/creator-documents.md)。提示词条目与真实图片分别记录，不能把下游挂图计划当成本条提示词已有输入。

## Quick Start

```text
用 $short-drama-image-prompts 为 EP001 已确定的人物、地点和道具写可直接复制的图片提示词
```

## 入口

有当前视觉设定即可直接开始；剧本只在提示词需要确认剧情状态时读取。Look Development 是可选分支。
先确认用途：身份板、造型/状态变体、地点板、道具板、组合 production sheet 或比较风格帧。
Director 当前默认图片入口为 GPT Image 2.6；用户已选入口优先。尺寸、编辑能力和完整参考准备见 [本地能力](../../../docs/workflow/references/local-model-capabilities.md)。默认提供清晰完整的人物、造型、空间与道具参考；不把人物强行摆成每镜首尾姿态。仅在需要专门构图或终态图时从已定分镜补图，不强制另建 IMG 条目；沿用当前镜号与提示词位置。

创作者可读说明跟随项目语言；可复制正文跟随 `short-drama.json#/format/prompt_language`。没有
`short-drama.json` 时正文默认
使用 `en`，并在同一任务中保持一致；不能从创作者说明语言推断提示词语言。

## 工作流

1. 锁定这一张图要固定的身份、状态、空间或比较变量。
2. 只读所需资产事实、视觉方向、负面约束和已提供参考图。
3. 按“主体与身份锚点 → 当前变体 → 构图/视角 → 光色/材质 → 背景边界 → 禁止项”写正文。
4. 每张参考只控制已声明的范围，明确用途；使用五文档格式时按交接格式填写 REF，内容写法见 [通用配方](references/common-recipe.md)。
5. 检查身份与变体、文字政策、视角和光线是否冲突。
6. 用户要全部资产就完成全部，资产组只是内部批次。

## 提示词要求

- 开头先写对象和用途，不用风格词淹没身份。
- 只包含当前图能同时满足的要求；多视图/状态对照写清版面关系。
- 保留稳定识别锚点，变体只改允许变化的部分。
- 被《视觉设定.md》连续性锁点名的条目，锁面原样出现在可复制正文里，让这张参考图本身就把跨镜事实定住。
- 避免无验证作用的质量词堆砌。
- 可见文字、logo、水印、界面和字幕明确允许或禁止。
- 正文可直接复制，不含占位符、流程说明、文件路径或 QA 结论。

## 按需知识

默认只读本 SKILL 和当前视觉设定。遇到对应问题时只打开一份：

- 阶段边界与规则分级：[阶段契约](references/stage-contract.md)
- 普通单图的最小配方：[通用配方](references/common-recipe.md)
- 人物身份板与造型一致性：[人物与造型](references/character-and-look.md)
- 地点地理、视角和光线：[地点板](references/location-plate.md)
- 功能道具、尺度、材质与文字：[道具板](references/prop-plate.md)
- 造型和状态变体：[造型与状态变体](references/look-and-state-variant.md)
- 多对象组合板：[Production Sheet 配方](references/production-sheet-recipes.md)
- 比较视觉方向的代表帧：[Lookdev 风格帧](references/lookdev-frame.md)
- 局部修改和 preserve set：[定点修改](references/edit-and-revision.md)
- 完成前的可生成性检查：[审查与示例](references/review-and-fixtures.md)

## 完成与投产

每个点名对象都有明确用途、可复制正文、参考边界和禁止项，且相互不矛盾，即完成。本次请求同时
修改图片提示词与分镜时，当轮刷新受影响镜头的「图片提示词项」，不另建对账产物。实际生成必须
按[生产路由与授权](../../../docs/workflow/references/production-routing.md)交给作品选定入口：使用 Toonflow。本技能只写提示词。
写完本阶段文档后，可转 `$short-drama` 做局部机械核对（只核对已有文档）；五份齐备后再做完整核对。内容质量仍由创作者审查。
