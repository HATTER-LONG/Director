# 07 H3 视频提示词

有分镜、目标镜号和参考计划，要写、改或审核 H3 视频提示词时，读本页。先读 [AGENTS.md 的 H3 项目规则](../../AGENTS.md#h3-提示词项目规则)。规则与 Skill 冲突时，以项目规则为准。

## 使用 Skill

- [h3-cinematic-director](../../.agents/skills/h3-cinematic-director/SKILL.md) 细化表演、运镜与可见终点。
- [h3-prompt-writing](../../.agents/skills/h3-prompt-writing/SKILL.md) 按实际模式编译官方字段。基础模式读 `base-en.txt`，Ref2VA 读 `ref-en.txt`。涉及对白时也查基础指南。
- [minimax-h3-prompt-writer](../../.agents/skills/minimax-h3-prompt-writer/SKILL.md) 检查参考、对白、声音和续镜。[minimax-h3](../../.agents/skills/minimax-h3/SKILL.md) 检查本地节点与参考接线。
- 整集的逐镜文档用 [short-drama-video-prompts](../../.agents/skills/short-drama-video-prompts/SKILL.md) 组织。

## 操作

1. 核对本镜的剧本对白、分镜和真实参考。根据节点能力选文生、首帧、首尾帧或参考生视频。已有挂图计划时可先写提示词和挂图清单。缺少参考时保留原有生成方式，等用户明确选择后再改为文生视频。
2. 按实际输入顺序绑定参考。说明人物、场景、动作或声音各取自哪个文件。把提示词中的图片、视频和音频标签逐项对回输入。多媒体编号按所选模式处理。
3. 先写起始画面、触发动作、可见终点和镜头运动。用 `[Shot N]` 写镜序，具体切点交给 H3。默认省略镜头时间戳。首帧或首尾帧模式所需的帧对齐声明按官方格式保留。
4. 画面和动作写英文，中文对白保留原文。说话人、表演和声线放在 `<d>` 外。完整发声的 `</d>` 后加 `[END_OF_DIALOGUE]`。跨镜未完句等说完再加。用画面事件交代声音起落。
5. 合并成一版可复制提示词。复核起止状态、参考标签、对白原文及声画关系。总时长作为节点参数交接。

## 交付

输出当前镜头的最终提示词、生成模式、真实参考或挂图计划，以及画幅、总时长和声音要求。整集可用 `剧集/<EP>/视频提示词.md`，镜头条目关联原 `SHOT-...`。准备提交时转[视频生成](08-toonflow-generation.md)。
