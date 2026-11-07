# 07 H3 视频提示词

输入为当前分镜、目标镜号、对白与参考计划。本阶段交付可复制提示词及提交所需的模式、参考顺序和参数说明，不因完成文稿自动生成。

## 使用 Skill

- [short-drama-video-prompts](../../.agents/skills/short-drama-video-prompts/SKILL.md) 维护镜头提示词文档；只改一个节点时沿用其现有位置。
- [h3-prompt-writing](../../.agents/skills/h3-prompt-writing/SKILL.md) 是格式入口，按实际模式读取官方指南并应用 [Director profile](../../.agents/skills/h3-prompt-writing/references/director-profile.md)。
- 只有需要调整表演、摄影或动作边界时才读 [h3-cinematic-director](../../.agents/skills/h3-cinematic-director/SKILL.md)。已出片的参考、对白或声音问题读 [minimax-h3-prompt-writer](../../.agents/skills/minimax-h3-prompt-writer/SKILL.md)；节点故障读 [minimax-h3](../../.agents/skills/minimax-h3/SKILL.md)。

## 操作

1. 核对当前剧本、分镜、采用素材与用户反馈。模式和有效时长按 [实际部署](references/local-model-capabilities.md)，不把参考用途当成首尾帧端口。缺图可先完成草稿和挂图计划，不自动改成文生视频。
2. 按实际挂载顺序对应图片、视频与音频。逐项说明保留的身份、空间、动作或声线；只引用当前适用版本。
3. 将已定镜头编译成模型字段，写清取景、开镜状态、触发、行动、终点与声音。语言、镜序、对白标签和结束符按 Director profile，不在此另立语法。
4. 按 [跨段剪辑接口](06-storyboard.md#跨生成段的剪辑接口) 写后段开场。连续动作所需参考、截取和音轨接法按 [本地流程](references/local-model-capabilities.md#两段视频怎么衔接)；未取得实际片段时标记尚不可提交。
5. 合并一版完整提示词，按相同的 profile、timing、模式和有效时长校验，再回读正文与参考清单。校验报错修复后才可提交，结构通过不替代成片验收。

## 来源与引用更新

引用以 [素材交接清单](08-toonflow-generation.md#素材交接与镜头画布) 中的当前文件为准。上游剧情、声音或显示状态改变时，先按 [变更传播](references/production-principles.md#来源改变后更新哪些地方) 更新来源，再核对全部受影响字段、参考清单、节点输入和编号；不能只在末尾追加一条否定旧设定的句子。

确认每个反应都有剧本允许的触发依据：谁能看见、听见什么，设备能显示什么。不得通过挂图或接线自行改变这些事实。

## 按问题补充设计

空间、接触、取景、环境与动作编排、特效和竖屏遮挡见 [镜头描述](../../.agents/skills/h3-cinematic-director/references/shot-description.md) 的相关章节。反复跑偏时按 [共性问题排查](references/h3-prompt-diagnosis.md) 整理当前版本，区分输入冲突与尚未验证的模型倾向。

## 交付

交付最终提示词、模式、真实参考或挂图计划，以及画幅、时长和声音要求。整集沿用现有视频提示词文档，条目关联原镜号。生成范围已授权且必要输入齐备后，进入 [08 视频生成](08-toonflow-generation.md)。
