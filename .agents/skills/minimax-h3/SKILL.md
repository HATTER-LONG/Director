---
name: minimax-h3
description: 排查本地 ComfyUI 的 H3 节点、参考接线、权重、量化、加速与显存问题。实际参数以部署节点为准；提示词格式由 h3-prompt-writing 维护，声音与续镜文本诊断按需使用 minimax-h3-prompt-writer。
---

# H3 本地运行排障

本技能负责实际节点与运行问题。普通提示词写作使用 [h3-prompt-writing](../h3-prompt-writing/SKILL.md)，对白、参考绑定和续镜文本问题使用 [minimax-h3-prompt-writer](../minimax-h3-prompt-writer/SKILL.md)。

## 先定位入口

读取实际工作流、节点类型、任务 ID 和错误输出，区分托管 API 与本地权重。Director 当前部署见 [本地模型能力](../../../docs/workflow/references/local-model-capabilities.md)；工作流或版本变化后重新核对。节点代码与快照不一致时记录差异，以实际能力执行，不静默换模式、丢参考或改模型。

操作 ComfyUI 前读取该工作机的 AGENTS；队列、节点信息和工作流操作使用 [comfyui](../comfyui/SKILL.md)。Toonflow 的节点与画布操作使用 [toonflow](../toonflow/SKILL.md)。

## 按问题读取

| 问题 | 依据 |
| --- | --- |
| 本地模式、时长、分辨率、参考读取范围或音轨接法 | [部署能力](../../../docs/workflow/references/local-model-capabilities.md) 和当前图 |
| 权重、量化、显存、预览或加速组件 | [reference.md](reference.md) 的对应章节；先核对安装版本 |
| 节点与插槽、模型许可 | [ComfyUI 模型索引](../comfyui/MODELS.md) 中的 H3 条目及对应节点源码 |
| 原任务超时、停止或刷新后未收回 | [恢复规则](../../../docs/workflow/references/local-model-capabilities.md#超时停止和恢复) |
| 提示词格式或历史示例比较 | [格式入口](../h3-prompt-writing/SKILL.md)；仅比较时读 [上游示例快照](prompt-examples-upstream.md) |

## 排查顺序

1. 记录实际模型、节点版本、参考文件及顺序、入参、任务状态与错误，先区分运行失败和成片质量问题。
2. 核对输入是否接到正确插槽、帧数与尺寸是否符合节点、模型文件是否匹配；提示词不能代替入参。
3. 根据日志验证一个具体假设。量化、加速或采样配置的改动保留原版，不能把社区示例当成本机已验证配置。
4. 超时先查原任务与已有输出。恢复、重试和可能影响其他任务的停止操作按 [生产路由](../../../docs/workflow/references/production-routing.md) 判断范围。
5. 回收实际文件，核对尺寸、片长和音轨；动作、身份或对白是否合格交 [视频验收](../../../docs/workflow/09-video-review.md)，不把运行成功当成质量通过。

交付问题证据、实际修改、任务状态和未验证项，写入作品制作记录。成片症状只能提供排查方向，不能单凭脸漂移或声音异常断定某个标签或参数是唯一原因。
