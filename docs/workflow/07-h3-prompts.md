# 07 H3 视频提示词

输入为当前分镜、目标镜号、对白与参考计划。本阶段交付可复制提示词及提交所需的模式、参考顺序和参数说明，不因完成文稿自动生成。

## 读取路线与职责

| 本轮任务 | 负责入口 | 补读条件 |
| --- | --- | --- |
| 新写或修改镜头提示词 | [short-drama-video-prompts](../../.agents/skills/short-drama-video-prompts/SKILL.md) 维护现有文档；[h3-prompt-writing](../../.agents/skills/h3-prompt-writing/SKILL.md) 编译最终正文 | 读取所选模式指南、[Director profile](../../.agents/skills/h3-prompt-writing/references/director-profile.md) 和 [内容取舍与多轮修订](../../.agents/skills/h3-prompt-writing/references/prompt-composition.md)；本会话已读且未变可复用 |
| 空间、表演、摄影或动作边界需要改变 | [h3-cinematic-director](../../.agents/skills/h3-cinematic-director/SKILL.md) | 只读对应设计资料，采用方案回填分镜 |
| 已出片的参考、对白、声音或接续异常 | [minimax-h3-prompt-writer](../../.agents/skills/minimax-h3-prompt-writer/SKILL.md) | 按 [共性问题排查](references/h3-prompt-diagnosis.md) 取证，再回同一格式入口修订 |
| 节点、参数或模型运行故障 | [minimax-h3](../../.agents/skills/minimax-h3/SKILL.md) | 核对实际入口；不靠扩写提示词修节点 |

内容取舍只在 H3 技能参考中维护；本页规定执行顺序和交接。上游指南的详细程度、建议字数及切镜默认值按 Director profile 解释，不成为另一套规则。

## 操作

1. **核对当前依据。** 读取受影响分镜、原对白、采用素材、相邻接镜与最新反馈。只改局部文字不重开导演方案。模式与有效时长按 [实际部署](references/local-model-capabilities.md)；缺图可完成草稿和挂图计划，不自动改成文生视频。
2. **先写内容线。** 用一句话明确本段要表达的变化，再按分镜写取景、开镜状态、行动、对白、反应和终点。先保证观众能理解，再补执行必需的事实与有证据的异常控制。
3. **编译并限定参考职责。** 按图片、视频、音频各自的真实挂载顺序绑定标签，说明身份、空间、构图、物件或声线分别取自哪里。共用事实集中；逐镜正文保留本镜真正发生的内容。跨段开场按 [剪辑接口](06-storyboard.md#跨生成段的剪辑接口)，连续动作所需真实片段按 [本地流程](references/local-model-capabilities.md#两段视频怎么衔接)。
4. **整理全文。** 局部修改替换旧句，整段回读。重复、过期、主次失衡或补丁堆积时，即使没有字面矛盾，也按当前分镜重新组织完整版本。按 [篇幅约定](../../.agents/skills/h3-prompt-writing/references/prompt-composition.md#内容与异常控制的篇幅) 检查内容与控制；不得为比例删必要事实、改台词或添废话。
5. **分开验证内容与格式。** 核对重点、对白归属、人物位置和状态变化，再用同一 profile、timing、模式及有效时长运行格式校验。格式报错修复后才可提交；篇幅和语义由人工复核，校验器通过不代表动作、声音或成片已通过。
6. **保存并回读。** 同步当前文档、卡片和受影响引用，确认完整正文、实际输入与参数一致。保存冲突按 [08](08-toonflow-generation.md#保存与编辑器冲突) 处理。只改提示词时保留现有运行参数，旧 take 继续标明其原始输入版本。

## 来源与引用更新

引用以 [素材交接清单](08-toonflow-generation.md#素材交接与镜头画布) 中的当前文件为准。剧情、感知权限、持续外观、对白、镜序或动作边界需要变化时，按 [变更传播](references/production-principles.md#来源改变后更新哪些地方) 回负责阶段修订，再更新受影响提示词全文、参考清单和节点；不能只在末尾追加一条否定旧设定的句子。

人物在场与画外状态按 [分镜](06-storyboard.md#人物在场与对白覆盖)，固定机位的左右关系按 [镜位依据](06-storyboard.md#重复机位与画面左右)，持续外观按 [视觉设定](04-visual-assets.md#素材需要承接的事实)。必要的感知权限、关键接触和跨段接口不能因精简而丢失。

## 交付

交付一版最终提示词、真实参考或挂图计划，以及模式、画幅、时长和声音说明。整集沿用现有视频提示词文档，条目关联原镜号。保存与校验结果如实记录，未经新样片验证的修订标为待验证。生成范围已授权且必要输入齐备后，进入 [08 视频生成](08-toonflow-generation.md)。本轮得到的可复用经验按 [经验迭代](references/production-principles.md#经验如何进入共用规则) 更新对应条目。
