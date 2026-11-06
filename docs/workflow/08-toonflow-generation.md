# 08 Toonflow 视频生成

用户要求实际生成视频，且已有明确镜头、提示词和参考时，读本页。工作机地址及连接要求见 [AGENTS.md](../../AGENTS.md#工作环境)。

## 使用 Skill

使用 [toonflow](../../.agents/skills/toonflow/SKILL.md) 操作工作机上的项目、画布和视频节点。需要排查本地工作流时按问题查 [minimax-h3](../../.agents/skills/minimax-h3/SKILL.md) 和 [comfyui](../../.agents/skills/comfyui/SKILL.md)。

## 操作

1. 确认服务和目标画布可用。调用 `getAppState` 取得当前 `connectionId`、`directory`、`canvasId`。切换项目或画布后重新读取。
2. 按镜号定位实际节点。用 `getCanvasNodes` 查端口与数据，用 `getCanvasEdges` 查连接，用 `getNodeTools` 查节点支持的函数和参数。已有画布和打开的文档通过 MCP 修改。
3. 核对节点实际使用的模式、预设、总时长、画幅、分辨率和声音选项。把当前提示词和真实参考连到正确端口。按实际入参核对挂图顺序、文件版本和正文标签。发现缺图或参数冲突时回到对应上游修正。
4. 按用户授权的镜头和数量提交。需要先验证新模式时，用有代表性的镜头检查参考、动作和声音。项目另用独立适配器时，按 [short-drama-produce](../../.agents/skills/short-drama-produce/SKILL.md) 的预览、确认、运行流程走。同一次任务只走一个入口。
5. 用节点提供的状态函数跟进。记录任务 ID。超时先查原任务、队列或已有输出，再决定是否补跑。看到任务完成后核对实际输出，读出文件位置、实际时长和音轨情况。

## 交付

回报镜号、take、任务 ID、实际预设和参数、参考顺序及可播放视频位置。任务尚在运行或取不到文件时，按当前证据报告状态和具体卡点。成功出片后转[视频验收](09-video-review.md)。
