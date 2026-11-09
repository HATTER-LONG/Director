# Agent integrations: upstream installation reference

This is a historical upstream installation guide, not Director agent instructions. The upstream repository layout and integrations below are not the current production-machine configuration. For Director installation, use [the repository README](../../../README.md#在-linux-上接入-toonflow); for runtime access, use [machine.md](machine.md).

The hard part (driving ComfyUI) is the **same MCP server** for every agent: `comfyui-mcp`. What differs per agent
is (a) where the knowledge file lives and its format, and (b) how the MCP is registered. This kit ships one shared
core (`shared/comfyui/`) and a thin adapter per agent (`agents/<name>/`).

| Agent | Knowledge file | Where it goes | MCP registration | Skill auto-load? |
|---|---|---|---|---|
| **Claude Code** | `SKILL.md` (frontmatter) | `~/.claude/skills/comfyui/` | `claude mcp add comfyui --scope user -- comfyui-mcp` (→ `~/.claude.json`) | yes, progressive disclosure |
| **Codex CLI** | `SKILL.md` (same format!) | `~/.agents/skills/comfyui/` | `~/.codex/config.toml` `[mcp_servers.comfyui]` or `codex mcp add` | yes, progressive disclosure |
| **Gemini CLI** | `GEMINI.md` (no frontmatter) | `~/.gemini/extensions/comfyui/` | `gemini-extension.json` → `mcpServers.comfyui` | no, always-on context |
| **Qwen Code** | `QWEN.md` | `~/.qwen/extensions/comfyui/` | `qwen-extension.json` → `mcpServers.comfyui` | no, always-on context |

Verified against each tool's official docs (June 2026). Two notable facts:
- **Codex skills** use `SKILL.md` with `name` and `description` frontmatter. Skill discovery paths depend on the installed Codex version; the historical installer path in the table is not an exclusive list of supported paths.
- **Gemini and Qwen have no skill auto-loader.** Their "extension" bundles the MCP server plus a context file
  (`GEMINI.md` / `QWEN.md`) that is always loaded. The adapter generates that context from the shared `SKILL.md`
  body (frontmatter stripped). Qwen Code is a Gemini-CLI fork; the only real differences are the config dir
  (`~/.qwen`) and the manifest name (`qwen-extension.json`).

## GLM 5.2 (Zhipu / z.ai)

GLM has **no first-party standalone CLI.** "GLM Coding Plan" is an API endpoint you drive from an existing harness.
The common path is **stock Claude Code** pointed at z.ai's Anthropic-compatible endpoint, configured in
`~/.claude/settings.json`:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "your_zai_api_key"
  }
}
```

Because that is unmodified Claude Code, it reads the **same `~/.claude/skills/`** this kit installs. So **the
`claude` adapter already covers GLM**: install it for `claude` and run GLM through Claude Code; nothing GLM-specific
to build. (If instead you run GLM via Cline / OpenCode / Roo with z.ai's OpenAI-compatible endpoint
`https://api.z.ai/api/coding/paas/v4`, register `comfyui-mcp` in that tool's own MCP settings; the knowledge in
the installed [SKILL.md](SKILL.md) still applies as that tool's instructions file.)

## Install

The top-level `install.ps1` / `install.sh` runs the shared setup once, then auto-detects which of `claude`,
`codex`, `gemini`, `qwen` are on PATH and installs for each. Limit with `-Agents` / `--agents`. Re-runnable.
