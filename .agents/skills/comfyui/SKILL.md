---
name: comfyui
description: 构建、运行或排查 ComfyUI 工作流、节点、队列与本地资源。仅在需要实际 ComfyUI 操作或运行诊断时使用；普通模型提示词编写由对应模型技能负责。
metadata:
  type: reference
---

# ComfyUI 运行入口

本技能处理实际工作流和运行问题。已通过 Toonflow 节点生产时，先在 Toonflow 查状态与参数；只有需要排查底层服务或修改工作流时进入这里。写提示词不启动服务、不加载整个运行手册。

## 操作前

读取 [machine.md](machine.md) 指向的现有工作机规则，使用实际 API、安装路径和启动策略。查服务健康、队列和目标节点的实时输入输出，不从模板猜测能力。运行授权沿用 [生产路由](../../../docs/workflow/references/production-routing.md)，现有任务先查询再重试。

## 按任务读取

| 任务 | 资料 |
| --- | --- |
| 连接、API 客户端、工作流 JSON | [运行手册](runtime-guide.md#the-client-no-extra-deps-stdlib-only) 的对应章节；[comfy_client.py](comfy_client.py) |
| 已有常见任务或模板 | [TASKS.md](TASKS.md)；先复用已验证工作流，不为普通调用重建模板库 |
| 新建或连接节点 | [节点索引](NODE_LIBRARY/_INDEX.md)、[KNOWN_ISSUES.md](KNOWN_ISSUES.md)；再读对应节点条目并查实时 schema |
| 模型对应工作流 | [MODELS.md](MODELS.md) 索引及命中的模型文档；H3 运行问题用 [minimax-h3](../minimax-h3/SKILL.md) |
| 工作流保存与可读布局 | [运行手册](runtime-guide.md#build-a-workflow-and-show-it-in-the-owners-gui-bidirectional-bridge) 与 [workflow_layout.py](workflow_layout.py) |
| 显存、权重、设备分配或服务启动 | [运行手册](runtime-guide.md#where-models-live-and-how-to-download-one-detect-do-not-assume) 的相关章节；遵守工作机现有策略 |
| 复杂图像、序列或颜色处理 | [ADVANCED.md](ADVANCED.md)，按问题补节点资料 |
| 用户要求安装、升级或开发节点 | [BUILDING_NODES.md](BUILDING_NODES.md)、[UPDATING.md](UPDATING.md)；不因普通生成自动升级 |

手册沿用上游目录说明：本安装内文件与 SKILL.md 同级，旧 `docs/` 前缀对应当前技能目录。手册的默认端口、启动询问或个人维护流程不能覆盖已读取的工作机规则、当前任务范围与既有授权。

## 运行和收回

1. 核对当前工作流、真实参考、模式、有效时长、预设与目标产物，保留已有成功配置。
2. 经当前授权提交，立即记录任务 ID。排队和运行中用实际状态跟进，超时先查询原任务。
3. 下载或定位真实输出，核对媒体类型、实际时长与音轨；技术成功不等于质量通过。
4. 只修本次故障涉及的节点、参数或资源；保留上一版工作流和 take，未经授权不安装模型或重启另一个服务。

H3 最终文字格式由 [h3-prompt-writing](../h3-prompt-writing/SKILL.md) 和 Director profile 维护，本技能只提供运行能力与参数证据。
