# Director

Director 为使用 Toonflow 制作 AI 短剧、漫剧和叙事短片的 Codex 项目提供共用规则和写作 skill。[AGENTS.md](AGENTS.md) 记录作者的制作约定与工作机配置。自己的部署地址和目录可以按实际环境调整。

## 在 Linux 上接入 Toonflow

把 Director 仓库放在 Toonflow 安装目录旁边。下面以 `~/WorkSpace/` 为例，`workspaces` 应指向 Toonflow 实例实际使用的工作区根目录。

```sh
git clone https://github.com/HATTER-LONG/Director.git "$HOME/WorkSpace/Director"
director="$HOME/WorkSpace/Director"
workspaces="$HOME/WorkSpace/toonflow/data/workspaces"

test -f "$director/AGENTS.md" && test -d "$director/.agents/skills" &&
  test -d "$workspaces" &&
  mkdir -p "$workspaces/.agents" &&
  ln -sT "$director/AGENTS.md" "$workspaces/AGENTS.md" &&
  ln -sT "$director/.agents/skills" "$workspaces/.agents/skills" &&
  touch "$workspaces/.director-toonflow-root"
```

如果 `workspaces/AGENTS.md` 或 `workspaces/.agents/skills` 已存在，先检查原有配置。指向同一份 Director 内容的链接可以沿用。有自己的规则或 skill 时，先合并再接入。

在 `~/.codex/config.toml` 的顶层加入工作区标记，已有 `project_root_markers` 时把新标记加到原列表中。

```toml
project_root_markers = [".git", ".director-toonflow-root"]
```

在 Toonflow 的「选择服务器工作目录」中创建并打开作品目录，再用 Codex 在同一个目录启动新会话。Codex 会加载共用的 `AGENTS.md`、发现 `natural-zh-writing`，并读取作品目录自己的 `AGENTS.md`（如有）。更新 Director 仓库后，新会话会通过符号链接读取更新后的规则和 skill。
