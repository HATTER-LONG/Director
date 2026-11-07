---
name: short-drama
description: 基于文件系统初始化和继续短剧或漫剧项目，提供五文档衔接方法、本地 Dashboard、制作形态与 Look Development 决策。用户提出“创建/继续短剧项目”“看进度/下一步”“做 Look Development”“打开 dashboard/短剧创作台”“导出制作资料”，或任务跨多个创作阶段时使用；明确的写作、资产、提示词、分镜、剪辑或审查请求由对应子 skill 直接处理。
license: MIT
---

# 项目初始化与跨阶段衔接

本技能负责项目初始化、进度定位、跨阶段衔接、制作形态与 Dashboard。明确的剧本、素材、分镜或提示词任务直接交对应阶段，入口统一见 [AGENTS 阶段表](../../../AGENTS.md#制作文档入口)，不必先运行本技能。

## 先定位当前任务

1. 使用用户给定的作品目录和最新要求，读取当前阶段的直接输入，检查已有成果与未完成项。
2. 现有项目沿用目录、编号和文档。没有现成结构的新项目可按需维护剧本、视觉设定、图片提示词、分镜和视频提示词五份 Markdown；不预建空文件。
3. 跨阶段按 [五文档工作流](references/creator-workflow.md) 衔接。每项事实由负责阶段修改，再同步下游；不建立并行的创作 JSON。
4. 缺素材时先查现有文件；本轮包含生成就按授权补齐，只写文稿则列计划并完成可写部分。没有手工指定图片不等于选择文生视频。
5. 检查本轮涉及的引用和状态。使用五文档解析器的项目按 [交接格式](references/creator-documents.md) 核对已有文档，不为通过工具补造未请求阶段。

阶段技能负责创作事实，专项技能回填设计或审查结论。`项目开发/` 的原著分析、分集索引与对标拆解只在需要时建立；剪辑单和制作记录按实际生产需要维护，不受五份创作文档数量限制。

## 按任务使用工具

| 任务 | 操作 |
| --- | --- |
| 初始化带配置的新项目 | `python3 {技能目录}/scripts/project_tool.py init <project> --title "项目名"` |
| 更新已有生产或节奏档案 | 读 [项目配置](references/project-tools.md#初始化与生产档案)，登记用户已确认选择 |
| 打开、定位或关闭 Dashboard | 读 [Dashboard 操作](references/project-tools.md#dashboard)；仅用户要求时启动 |
| 导出已有文稿与成品 | 读 [导出当前状态](references/project-tools.md#导出当前状态)，按指定范围打包 |
| 安装、升级或排障 | 才运行 `python3 {技能目录}/scripts/selftest.py` |

项目路径与安全写入见 [运行预检](references/runtime-preflight.md)。已确定模型和入口时直接沿用，在现有制作记录记参数；已有配置项目再同步其档案，不能把发布配置变成写提示词的前置关卡。

## 按问题补读

- 创作方法的负责技能与规则分级：[规则与路由索引](references/knowhow-index.md)。
- 输出语言、稳定 ID 与文档职责：[契约与所有权](references/contract-and-ownership.md)。
- 实拍、二维、三维、水墨等形态差异：[制作形态](references/production-form-profiles.md)。
- 比较代表帧：[Look Development](references/look-development.md)。
- 参考图控制范围：[参考角色](references/reference-roles.md)。
- 遮挡、延迟揭示与观众知情时机：[观众揭示](references/audience-reveal.md)。
- 母版、补拍和替代版：[补拍与替代](references/pickup-and-alternate.md)。

## 生产与交付

实际媒体生成按 [生产路由与授权](../../../docs/workflow/references/production-routing.md)，不另设确认流程。归档只包含请求范围内的文稿和成品，排除私有输入、凭据和隐藏运行状态；导出快照不宣称创作者采用或质量通过。

完成用户指定的完整范围后，回报交付物、关键选择和未解决问题。批次只用于组织工作，不把每个内部批次变成新的用户确认。
