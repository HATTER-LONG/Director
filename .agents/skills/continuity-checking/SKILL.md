---
name: continuity-checking
description: Audit axes, screen direction, wardrobe, props, lighting, and eyelines across shots and scenes.
metadata:
  origin: everything-ai-filmmaking
  category: post
---
<!-- Adapted for Director from everything-ai-filmmaking; see repository provenance. -->

# Continuity Checking

## Purpose
Verify that the film holds together as continuous space and time: axis and
screen-direction discipline across cuts, wardrobe and prop state across scene
time, lighting and time-of-day coherence, and eyelines that meet — with all
state tracked in a file, not in memory.

## Use When
- After shots are planned or generated for a scene.
- Before approving clips for the edit.
- After any bible or blocking change that could invalidate downstream shots.

## Inputs

Read the current 剧本.md, 分镜.md, 视觉设定.md and the relevant actual reference frames or clips. Keep existing scene and shot IDs. A project may already use structured files, but this skill does not require YAML, an external schema or another toolchain's commands.

## Process
1. Load incoming state: what the previous scene left true — wardrobe states,
   prop locations and conditions, time of day, injuries, weather.
2. Axis audit: for each interaction, confirm every covering shot sits on the
   recorded side of the interaction axis; any crossing must cite a
   legal transition (neutral shot, tracked cross, re-establish).
3. Screen-direction audit: verify exit/enter directions across every cut and
   persistent travel direction across the sequence; flag flips with no
   on-screen turn.
4. Eyeline audit: derive gaze direction and height from the characters' positions, eye levels and each camera view. Conventional opposing singles often look toward opposite frame edges; height differences, shared targets and subjective views may differ. Flag contradictions to the actual layout, not every asymmetric pair.
5. Wardrobe/prop state audit in scene time (story order, not generation
   order): each shot must show the state the timeline says is current —
   suitcase in hand vs. on platform, coat wet after the rain scene starts.
6. Lighting/time audit: sun or practical direction consistent with the
   location map across all shots of the scene; time-of-day may only advance
   where the script advances it.
7. For generated media, compare frames against referenced masters and flag
   identity or geometry drift with the offending asset named.
8. Write findings as blocking defects (must fix before approval) or noted
   risks; record observed changes separately from planned state and route source corrections to the owner.

## Outputs

Return evidence-backed findings to the current review record: scene/shot/take, time or frame, observed state, impact and responsible stage. Keep planned state separate from observed state; the source owner decides revisions.

## Quality Bar
- Every shot audited against axis, direction, eyeline, state, and lighting.
- Relevant state changes recorded in existing project documents; no separate continuity database is required.
- Every defect names the shot, the rule broken, and the upstream owner.
- Story-order (not production-order) state is what gets tracked.

## Common Failure Modes
- Auditing shots in generation order, missing story-time state regressions.
- Passing eyelines per-frame without checking the pair mirrors.
- Treating a stylish axis break as intentional without a recorded transition.
- Updating continuity-state from intent (shot files) instead of what was
  actually generated.

## Notes

No automated continuity checker is bundled with this skill. Verify actual evidence manually or with available media inspection tools; never claim a missing script ran. Recheck only the affected shots and downstream joins after an upstream change.
