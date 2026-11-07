---
name: shot-sequencing
description: Order coverage into a cuttable sequence — axis discipline, cut points, screen direction, and shot-to-shot flow.
metadata:
  origin: everything-ai-filmmaking
  category: production
---
<!-- Adapted for Director from everything-ai-filmmaking; see repository provenance. -->

# Shot Sequencing

## Purpose
Turn a set of designed shots into a sequence that cuts: correct order, legal
axis behavior, motivated cut points, consistent screen direction, and clean
handoffs of entrances and exits between shots.

## Use When
- Assembling a shot list from cinematography decisions.
- the current storyboard needs shots ordered, timed, and joined.
- A sequence feels disorienting — reverses flip, movement jumps, geography breaks.

## Inputs

Read the current 剧本.md, 分镜.md, 视觉设定.md and the relevant actual reference frames or clips. Keep existing scene and shot IDs. A project may already use structured files, but this skill does not require YAML, an external schema or another toolchain's commands.

## Process
1. Order shots by dramatic logic, not shooting logic: establish geography
   before close coverage unless withholding it is the point; re-establish
   after any spatial change (entrance, big move, axis reset).
2. Enforce the 180° rule per axis: all coverage of an interaction stays on the
   recorded side of the interaction axis; crossing requires a neutral shot
   on the axis, a shot that tracks across it, or a new establishing view.
3. Use the 30° rule as a continuity heuristic: consecutive shots of the same subject differ by at
   least 30 degrees or a full shot size to avoid accidental jumps; an intentional jump cut can be appropriate.
4. Check travel direction against the adopted camera positions and action. For a continuous lateral move on the same axis side, an exit right normally pairs with an entry left. A changed viewpoint, turn or ellipsis needs a readable transition; do not apply screen-edge labels without spatial context.
5. Choose cut points on motion, look, or sound: cut where the eye is already
   moving (a head turn, a reach, a door) and on reaction rather than after it;
   an eyeline out of frame licenses the cut to what is seen.
6. Record neighboring shots and cut states in the existing storyboard. Use `enters_from` and `exits_to` only if the project already uses those fields. Match the continuing action phase, hand and prop state; an intentional time jump needs a clear story basis.
7. Assign timing with handles: intended on-screen duration plus head/tail
   handles for the edit; verify total against the scene's target duration.
8. Read the sequence as rhythm: shot lengths should track the tension curve —
   shorten toward peaks, hold long when the audience must sit in a moment.

## Outputs

Return adopted camera or sequencing decisions to the same 分镜.md or existing shot cards. Preserve stable IDs, source scene, start/end state and reference duties; do not create a parallel shot index.

## Quality Bar
- No axis crossing without a legal transition shot.
- Adjacent same-subject cuts avoid unintended jumps; preserve explicitly designed jump cuts.
- Screen direction is stated per shot and consistent across cuts.
- Every shot has neighbors, timing, and a cut-point rationale.

## Common Failure Modes
- Coverage ordered as shot-listed (master, then all singles) instead of as cut.
- Reverses generated from opposite axis sides, flipping eyelines.
- Exits and entrances in the same screen direction, reading as a chase of oneself.
- Uniform 4-second shots regardless of tension, flattening the scene.

## Notes
Sequencing decisions are exactly what `continuity-checking` audits and what
short-drama-edit refines. Plan creative cut points first, then check the actual generation constraints; report incompatibilities before changing approved timing.
