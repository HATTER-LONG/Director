# 项目定位与安全写入

## 定位项目

优先使用用户给出的项目路径；没有项目时可以直接在用户指定目录完成独立任务。需要项目配置时运行：

```bash
python3 <core>/scripts/project_tool.py init <project> --title "项目名"
```

命令示例使用 `python3`；执行前确认解释器可用且为 Python 3.9 或以上。Windows 原生环境可用
`py -3` 或 `python`，同样先核对版本。
套件脚本（含 Dashboard）在 macOS、Linux、WSL 与 Windows 原生都可运行。

新建 creator-first 项目使用 `剧集/<EP>/`；已有 Toonflow 项目沿用原文档和目录。只读取当前任务需要的直接输入；不要扫描整个项目寻找可补造的上游。

## 写入纪律

- 创作正文直接写五份 Markdown，修改时保留未受影响内容与稳定可见 ID。
- 输入目录、隐藏运行目录、制作成果和凭据不是创作正文；不要把它们复制进提示词。
- 文本写入使用临时文件加原子替换；外部编辑发生时先重新读取，不静默覆盖。
- Dashboard 只展示和编辑项目文件，不承担创作路由或生产授权。
- 实际生产按[生产路由与授权](../../../../docs/workflow/references/production-routing.md)执行，已有范围内不重复确认。

输出语言、稳定 ID 与信任边界见 [契约与所有权](contract-and-ownership.md)。
