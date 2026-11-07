# H3 格式入口

最终格式只由 [h3-prompt-writing](../../h3-prompt-writing/SKILL.md) 维护，避免导演参考与格式技能各保存一份语法。

- T2VA / I2VA / FL2VA / L2VA：读取 [base-en.txt](../../h3-prompt-writing/references/base-en.txt)。
- Ref2VA：读取 [ref-en.txt](../../h3-prompt-writing/references/ref-en.txt)；涉及对白时按需查基础指南的声音章节。
- Director 中应用 [项目差异](../../h3-prompt-writing/references/director-profile.md)：默认无切镜时间戳，保留必要帧对齐声明，完整对白保留项目结束符。编译和校验选择同一 profile / timing。

导演设计写入模型规定的画面与声音字段，不增加新的顶层字段。描述语言按 Director profile 和用户要求选择，已确认对白、歌词和画内文字保留原文。有效时长和参考组合以实际节点为准。
