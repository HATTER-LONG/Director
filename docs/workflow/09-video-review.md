# 09 视频验收与返工

有实际生成视频，需要验收、选 take 或决定是否重跑时，读本页。用当前剧本、分镜和参考版本对照生成结果。

## 使用 Skill

- [continuity-checking](../../.agents/skills/continuity-checking/SKILL.md) 检查人物、道具和前后镜连续性。[shot-sequencing](../../.agents/skills/shot-sequencing/SKILL.md) 帮助判断切点和镜序。
- [h3-cinematic-director](../../.agents/skills/h3-cinematic-director/SKILL.md) 做单变量修复。按需用 [minimax-h3-prompt-writer](../../.agents/skills/minimax-h3-prompt-writer/SKILL.md) 查参考、对白和声音，用 [minimax-h3](../../.agents/skills/minimax-h3/SKILL.md) 查本地工作流。需要专项审查时用 [short-drama-review](../../.agents/skills/short-drama-review/SKILL.md)。

## 操作

1. 播放实际片段并听音轨。检查关键表情、动作终点、道具状态、对白完整性和说话人。只有图片时，验收范围限于可见画面。
2. 拼看相邻切点。对照上一镜采用部分的末尾和下一镜开头，检查视线、轴线、画面方向、持物手和声音是否接得上。
3. 按镜号、take 和时间位置记录问题及证据。能通过改入出点或声音桥解决的，先标可用区间。需要重跑时保留基线，一次优先改一个变量。
4. 根据原因退回负责阶段。角色或站位漂移先查[参考与分镜](06-storyboard.md)，对白或动作偏差查 [H3 提示词](07-h3-prompts.md)，报错、错参或输出缺失查[生成记录](08-toonflow-generation.md)。补跑按本次授权执行，结果回到本页再验收。

## 交付

列出采用 take、文件位置、可用入出点和需要补跑的镜头。保留对照版本及改动项。只交生成视频时，到可播放视频和验收记录为止。用户另要成片时，将选片交给 [short-drama-edit](../../.agents/skills/short-drama-edit/SKILL.md)。
