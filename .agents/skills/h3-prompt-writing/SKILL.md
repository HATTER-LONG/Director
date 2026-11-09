---
name: h3-prompt-writing
description: Write and revise MiniMax H3 video prompts, including consolidating overgrown prompts around the intended action and dialogue. Use for T2VA, I2VA, FL2VA, L2VA and Ref2VA structure, reference binding, shot descriptions and sound fields; runtime faults belong to the deployed workflow.
metadata:
  compatibility: Portable to any agent that can read local files — no external API calls, MiniMax Hub tools, or proprietary runtime required. The agents/openai.yaml file only adds optional ChatGPT/Codex UI metadata; it does not restrict the skill to OpenAI agents.
---

# H3 Prompt Writing

In Director, pair with [short-drama-video-prompts](../short-drama-video-prompts/SKILL.md): it owns the prompt document and approved shot content; this skill owns model syntax. Use the current production mode only for actual H3 segments. Loading the pair does not restart shot design or authorize generation.

## Workflow

1. Identify the actual input mode and preserve the approved shot purpose, actions and dialogue. Do not infer supported ports from a reference image's intended use.
2. Read [content selection and revision](references/prompt-composition.md) for both new drafts and edits. Write the intended scene content first, then necessary facts and scoped failure controls. Reuse an unchanged guide already read in this session.
3. For base text/keyframe modes, read `references/base-en.txt`; for Ref2VA, read `references/ref-en.txt`. Preserve the required fields, label meanings and applicable alignment sentences.
4. In Director, apply [director-profile.md](references/director-profile.md) over upstream defaults for detail, length, language, cut timing and dialogue endings. The upstream guides remain snapshots, not competing project rules.
5. Consolidate the complete current prompt, check content/control balance and actual reference order, then lint using the same profile, timing, mode and effective duration. Mechanical validation does not evaluate semantic balance or rendered quality.

## Base Modes

- T2VA: build the full audiovisual timeline from text.
- I2VA: start from the first frame and develop forward from it.
- FL2VA: describe the continuous path between the first and last frames.
- L2VA: infer a plausible opening and converge to the supplied last frame.

Use `integrated_multimodal_description`, `overall_soundscape`, and `non_diegetic_music` in the order shown in `references/base-en.txt`.

## Full-Reference Mode

Ref2VA rewrites use `subject_definitions`, `summary`, `retention_analysis`, `detailed_description`, `overall_soundscape`, and `non_diegetic_music` in that order. Reference labels stay consistent across all sections.

Read `references/ref-en.txt` for label rules, retention analysis, and complete examples.

## Output Rules

- Follow the user's chosen prompt language and, in Director, [director-profile.md](references/director-profile.md); English is the fallback only when neither overrides it. Preserve required field names, reference tags, and the original language of dialogue, lyrics and visible scene text.
- Describe the framing, action, performance, sound and reference use needed to make each shot readable. These are considerations, not a checklist that must expand every shot. Keep shared facts in their owning sections and localized controls beside the affected event.
- Do not substitute a plot synopsis for executable shot descriptions. Keep the required Ref2VA summary concise; avoid unresolved labels and timing that does not match the effective duration.
## Tips for Better Results
- Match the description and alignment sentences to the effective duration supported by the actual node or API; do not transfer hosted API limits to a local workflow.
- Keep reference labels consistent (e.g. `<Picture 1>`, `<Video 1>`, `<Audio 1>`) across every section.
- Prefer concrete visual and audio details over abstract words like "cinematic" or "beautiful".
- When using keyframes (I2VA / FL2VA / L2VA), clearly state how the first and/or last frame connects to the timeline.
