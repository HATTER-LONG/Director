# 标准 AI 视频制作

本模式依靠完整场景、人物表演、动作与镜头关系讲故事，适用于 AI 短剧、漫剧及叙事短片。写实、漫画、二维或三维是画风，不决定制作模式。以 TTS 和插画动画为主的作品走 [叙事动画](illustrated-narration.md)。

已有成果从当前步骤继续；单镜、单图和局部修订只读对应步骤。下表是完整制作顺序，系列开发和原著分析按需要启用，不要求每个短片先做分集。

## 步骤与读取顺序

| 步骤 | 当前交付与完成条件 | 读取与技能组合 |
| --- | --- | --- |
| 1. 确定故事方向 | 人物诉求、阻力、结果与改编边界明确；已有故事可复用 | [01 故事构建](../01-story.md)；short-drama-develop。需要长篇依据才加 short-drama-novel-analyze；只分析原著就停在分析范围 |
| 2. 规划分集（多集时） | 每集承担的变化、兑现和交接明确 | [02 分集规划](../02-episodes.md)；short-drama-develop |
| 3. 写剧本 | 场次、动作、对白、画外声和信息边界明确 | [03 单集剧本](../03-screenplay.md)；short-drama-write ＋ story-deslop ＋ natural-zh-writing |
| 4. 建立人物与空间设定 | 身份、造型、声音、道具状态及场景空间能支持剧情 | [04 视觉设定](../04-visual-assets.md)；short-drama-assets，需设计空间、美术或多机位再加 scene-asset |
| 5. 准备参考素材 | 本批需要的真实参考通过其用途检查，版本和来路可查 | [05 图片与参考素材](../05-image-references.md)；short-drama-image-prompts，实际生成加 toonflow。新建多机位空间按该页的场景流程；已有可用参考直接复用 |
| 6. 拆镜与排镜序 | 每镜有职责、起止状态、对白覆盖和接镜依据 | [06 分镜与镜序](../06-storyboard.md)；short-drama-storyboard，多镜序列加 shot-sequencing；专项技能只按具体问题加入 |
| 7. 编译视频提示词 | 对应已定镜头、真实参考和实际模型格式 | 使用 H3 时读 [07](../07-h3-prompts.md)；short-drama-video-prompts ＋ h3-prompt-writing。其他模型用其实际格式与运行入口，不套 H3 端口 |
| 8. 试片与正式生成 | 收回实际文件、任务 ID 和版本，先验证再扩大生产 | 使用 H3 时读 [08](../08-toonflow-generation.md)；toonflow，运行排障才加 minimax-h3／comfyui |
| 9. 验收与返工 | 单镜职责成立，相邻镜头可剪，问题能定位到来源 | [09 视频验收](../09-video-review.md)；continuity-checking，接镜检查加 shot-sequencing，返工按原因回对应负责人 |
| 10. 剪辑与交付 | 按采用素材完成声音、字幕、切点、导出和实测检查 | [short-drama-edit](../../../.agents/skills/short-drama-edit/SKILL.md)；需要重新设计镜序才加 shot-sequencing；补素材按原授权回对应步骤 |

步骤 5 和 6 可以交替：分镜未有实图时列参考计划，资产生产也不必等待所有镜头写完。镜头关键帧由 short-drama-storyboard 维护，实际生成时再加 toonflow；不能因步骤编号把关键帧交给资产提示词技能重写。

## 本模式的制作重点

- 场景服务人物调度和可剪接的机位。需要完整空间时建立布局、主视图与所需反打；只有一个局部镜头时不补造用不到的房间或整套机位。
- 人物身份、稳定造型和声线由设定与资产维护；站位、视线、手部动作和发声画面由分镜维护。参考板不代替镜头表演。
- 生成段长与剪辑镜长分开。先保住动作、对白和可剪区间，再根据实际素材安排节奏。
- 旁白和后期文字可以使用，但不因出现 TTS 就自动切换整部作品的模式。只有明确选择插画叙述的段落，才按另一模式安排静图与动画。

## 按条件复用

实际生产读取 [生产路由](../references/production-routing.md)、[通用原则](../references/production-principles.md) 和 [素材交接](../references/media-handoff.md)。人物参考板的身份与遮挡处理见 [人物参考](../references/character-references.md)。涉及 TTS、变速、ASR 或字幕时间时读 [配音与时间对齐](../references/voice-and-timing.md)。使用本地节点时核对 [实际能力](../references/local-model-capabilities.md)。

这些资料不改变本模式的制作步骤。返回上游只修受影响的事实，再同步下游引用；局部返工不重做全部流程。
