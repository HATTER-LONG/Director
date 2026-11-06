# Director

Director 用于制作 AI 短剧、漫剧和叙事短片。Agent 协助编剧和导演完成剧本、视觉设定、分镜、灯光与调度设计、生成提示词和制作记录。以当前作品的剧本、素材和已确认的分镜为准，只处理用户指定的阶段。发现剧情、人物或镜头要求有冲突时，先指出冲突，再继续能独立完成的部分。

## 项目目录

`Director/` 存放共用规则和 skill，可以独立放在 CachyOS 的 `WorkSpace/` 下。作品放在 Toonflow 允许访问的工作区中。按现有安装记录，目录布局如下。

```text
/home/layton/WorkSpace/
├── Director/
│   ├── AGENTS.md
│   └── .agents/skills/
└── toonflow/data/workspaces/
    └── <项目名>/
```

1. 在 Toonflow 的「选择服务器工作目录」中，新建 `<项目名>/` 文件夹并选中它。打开项目后，以 Toonflow 返回的实际路径为准。
2. 在 CachyOS 上用 Codex 打开同一个作品目录并新建会话。Codex 从 `workspaces/` 自动加载 `Director/AGENTS.md`，发现 `Director/.agents/skills/` 下的共用 skill，再读取作品自己的 `AGENTS.md`（如有）。
3. 剧本、设定和制作记录保存在当前作品目录，沿用已有结构。用户只要文稿或提示词时，直接交付。切换作品时，重新确认 Agent 打开的目录与 Toonflow 当前项目一致。

共用规则和 skill 在 `Director/` 中维护。CachyOS 上的 Toonflow `workspaces/` 通过符号链接引用这两处内容。

## 工作环境

| 组件 | 入口 |
| --- | --- |
| CachyOS 工作机 | `ssh layton@cachyos.home.arpa`，RTX 5070 Ti，16 GB 显存 |
| Toonflow 网页 | 在工作机上打开 `http://127.0.0.1:3000/`。从其他机器访问时，先建立下方的 SSH 转发，再打开 `http://127.0.0.1:13000/` |
| Toonflow MCP | `http://cachyos.home.arpa:3000/mcp`，使用已授权的凭据 |
| ComfyUI | `http://cachyos.home.arpa:8189`，操作前先读工作机上的 `/home/layton/WorkSpace/ComfyUI-clean/AGENTS.md` |

```sh
ssh -o ExitOnForwardFailure=yes -N -L 127.0.0.1:13000:127.0.0.1:3000 layton@cachyos.home.arpa
```

- 操作 Toonflow 前，用工作机 MCP 的 `getAppState` 核对连接、项目实际路径和当前画布。写入画布时使用返回的 `connectionId`、`directory` 和 `canvasId`。切换项目或画布后重新获取状态。
- 画布、节点和 Toonflow 中打开的文档通过 MCP 修改。先查节点支持的函数和参数，再调用对应工具。配置供应商、模型或插件前，用 `listAppOperations` 查询操作和参数。凭据保存在 `Director/` 目录外。用户明确要求委托 Toonflow 内置 Agent 时，才调用 `runAgent`。
- 生成前检查服务状态、所选预设和实际参考输入。H3 的可用模式、参数和有效时长以当前工作流为准。按用户授权提交任务，跟进实际输出。遇到超时，先查原任务再决定是否重试。

## 中文写作

默认用简体中文。起草、重写或润色剧本、创作阐述、项目说明、制作记录和对外文案时，按需读 [natural-zh-writing](.agents/skills/natural-zh-writing/SKILL.md)。保留事实、条件、判断强度和作者语气。只改影响理解或节奏的地方，已经通顺的句子可以保留。

写对白、分镜和提示词时，先按对应阶段的制作 skill 处理，再用 `natural-zh-writing` 检查中文表达。保留角色口吻、已确认的对白原文和镜头意图。提示词的字段、标签、参考顺序和时间约束以所用模型及工作流的要求为准。
