# H3 提示词诊断与校验

本目录诊断参考绑定、对白、声音、续镜与入口差异，并提供离线校验器。使用入口见 [SKILL.md](SKILL.md)。普通编写、字段语法和内容取舍由 [h3-prompt-writing](../h3-prompt-writing/SKILL.md) 维护，不在这里复制一套生成规则。

Director 中应用 [项目差异](../h3-prompt-writing/references/director-profile.md)，默认有序切镜，无切点时间戳。新写、局部修订和清理过长提示词都按 [内容取舍与多轮修订](../h3-prompt-writing/references/prompt-composition.md) 执行；格式检查不替代语义或出片验证。

`scripts/lint_prompt.py` 的 profile、timing、模式和有效时长应与编译一致，命令见项目差异。`references/base-en.txt`、`ref-en.txt` 是本诊断包的历史副本，仅供追溯比较，不能覆盖格式所有者的指南。其余资料按 SKILL 的具体问题索引读取。

本包原始来源为 [minimax-h3-prompt-skill](https://github.com/artificialguybr/minimax-h3-prompt-skill)，本地职责已收窄为诊断与校验。技术资料来源与时效见 [sources.md](references/sources.md)；其中外部入口能力需在实际使用时复核。
