# 项目配置、Dashboard 与导出

仅在初始化配置工具项目、更新其已有档案、打开 Dashboard 或导出时读取对应章节。普通 Toonflow 项目沿用已有文档与制作记录，不为使用技能创建 `short-drama.json`。文中的发布、接受与写入命令用于登记用户已经作出的决定，不是新增确认轮次。

## 初始化与生产档案

需要项目配置时运行：

```bash
python3 {技能目录}/scripts/project_tool.py init ./my-drama --title "示例短剧"
```

直接输入已经确认创作者说明语言、提示词语言、画幅、集数或单集目标时长时，首次 `init` 就带上对应的
`--language`、`--prompt-language`、`--aspect-ratio`、`--episode-count`、`--target-seconds`；只省略
未确认项，不让 Brief 中的确定事实留成配置里的 `null`。写入已确认的生产档案时，状态统一为
`accepted`；`unset` 只表示尚未决定，不另造中间状态。
`init` 只建立配置和空目录；第一次创作时再把文档写入 `剧集/<EP>/`，不预建空文件。
项目已经建好、用户之后才定下目标视频模型时，把选择写进档案，并同时展示它对时长区间、参考方式和
正文语言的影响。档案只能从已发布、已接受的创作者决策写入。先在 `输入/profile.jsonl` 写一行决策记录
（`accepted_value` 就是要落进 `choices` 的对象本身，不要再包一层 `choices`）：

```jsonl
{"decision_id":"CD-H3","status":"accepted","target_locators":[{"src":"short-drama","field":"/creator_authority/production_profile/choices"}],"accepted_value":{"target_video_model":"minimax-h3","video_prompt_dialect":"minimax-h3","video_prompt_language":"en","native_duration_seconds":{"min":2,"max":15},"supported_generation_modes":["text","reference"],"audio_generation":"same_pass"}}
```

再发布、接受、写入：

```bash
python3 {技能目录}/scripts/project_tool.py publish <project> --owner short-drama \
  --artifact-id AR-PROFILE --output "创作者决策/production-profile.jsonl=输入/profile.jsonl"
python3 {技能目录}/scripts/project_tool.py accept <project> --artifact-id AR-PROFILE --decision accepted
python3 {技能目录}/scripts/project_tool.py set-authority <project> \
  --field /creator_authority/production_profile/choices \
  --decision-ref "创作者决策/production-profile.jsonl#CD-H3"
```

各字段按实际入口核对，当前本地能力见 [H3 与 GPT Image 2.6](../../../../docs/workflow/references/local-model-capabilities.md)。上面的发布步骤仅用于已有配置工具项目登记当前用户决策，不是新的用户确认回合。

需要自动估时的项目可记录 `format.pacing`，但机械字数换算不替代实读、表演和分镜判断；没有数值时先估算并注明依据，不能因此阻断写作。`status` 的 `profile_notes` 是核对线索：先区分剪辑镜长与生成片长，已有输入能解决的直接修正，只有影响创作方向且无法推断时才问。


## Dashboard

项目定位与安全写入见 [运行预检](runtime-preflight.md)。用户明确要求 Dashboard 时运行：

```bash
python3 {技能目录}/scripts/dashboard_server.py --workspace <workspace> --port 0 --detach --open
```

`--detach` 让服务进程脱离当前 shell 独立运行，无需保持当前会话或终端开启。运行中的地址、端口和 pid 记录在
`<workspace>/.short-drama/dashboard.json`（仅本人可读），日志在同目录 `dashboard.log`：

```bash
python3 {技能目录}/scripts/dashboard_server.py --workspace <workspace> --status   # 打印当前链接
python3 {技能目录}/scripts/dashboard_server.py --workspace <workspace> --stop     # 停止
```

同一 workspace 已有在跑的 Dashboard 时，再次启动只会打印同一个链接，不再开第二个端口；确实要换
端口或换令牌时加 `--restart`。不加 `--detach` 时行为不变：前台运行，Ctrl-C 结束。

Dashboard 按阶段展示项目：全剧页给出下一步和分集进度，每集分剧本、设定、分镜、提示词、成片、审查
六个视图，⌘K 搜索全剧。结构视图只读，改动在「编辑原文」里保存 Markdown。画面只认文档里的绑定：
缩略图是分镜里 `用途：起始帧` 的 `REF-...`，每镜素材是剪辑单的「来源」，成片是剪辑输出；没有绑定
就显示空位，不按文件名配图。它不负责工作流编排或媒体生产，需要写作或生成的地方只复制一句请求交回对话。
每集目标时长取自 `status` 的 `format`，节奏对照只用已接受的 `rhythm_profile`。

## 项目级创作决定

制作形态、视觉方向、播放面和集长目标会影响多个阶段。沿用已确认选择；缺少且会改变制作方向时，展示候选及影响后由用户决定。画幅按播放面选择，不因短剧默认竖屏；有实际对标资料时可据此提出形态与画幅候选，不将单组样本推广为通用要求。

`init` 默认值只供初始化，不代表用户已经选择。项目建好后才确定画幅时，按前述决策步骤写入 `--field /format/aspect_ratio`，`accepted_value` 使用 `"16:9"` 这类宽高比。Look Development 是可选分支，不是进入图片提示词或分镜的门槛。

节奏数值（首钩秒数、情绪触点间隔、反转次数、VO 占比、平均镜长等）记录在
`creator_authority.rhythm_profile`。字段与默认值由 `$short-drama-develop` 按制作形态提出，
创作者接受或改写后，按上文三步写入：决策的 `accepted_value` 是不含 `status` 的完整档案值，`--field`
写 `/creator_authority/rhythm_profile`；档案已接受后，单改一个值时 `--field` 指向该字段。
`set-authority` 对节奏档案校验字段、类型与范围，缺字段、越界或多出未知字段都拒绝写入。下游只按 `status` 为 `accepted` 的档案做算术核对，缺失、`unset` 或
`proposed` 都表示「未声明，不核对」。写完用 `status` 复核 `rhythm_profile`；手改后档案不合法时
它返回空档案，问题列在 `rhythm_profile_problems`。


## 导出当前状态

用户问“做完了怎么导出/交付给我”时，用 `export` 打包当前状态：

```bash
python3 {技能目录}/scripts/project_tool.py export <project> --out <项目外目录>
```

它把每集现有的五份创作文档、`剪辑单.md` 和 `剧集/<EP>/制作成果/` 复制到 `--out`，附 `manifest.json` 与
`checksums.sha256`，并排除 `输入/`、`交付/` 和 `.short-drama/`。只要一部分时加
`--episode EP001`（可重复）；只要文字时加 `--no-media`；覆盖旧目录加 `--overwrite`。
`--out` 必须在项目之外。

`export` 是**当前状态快照**，manifest 里 `asserts_approval` 恒为 `false`：它不声称任何审查或
创作者接受。需要带审批证据的正式交付包仍然只有 `package`/`verify` 那条路径。
