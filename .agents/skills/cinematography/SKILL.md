---
name: cinematography
description: Choose shot size, angle, height, lens, and movement so the camera argues the drama.
metadata:
  origin: everything-ai-filmmaking
  category: production
---
<!-- Adapted for Director from everything-ai-filmmaking; see repository provenance. -->

# Cinematography

## Purpose
Translate dramatic intent into camera language: for every moment, the shot
size, angle, camera height, lens, and movement that make the audience feel
what the beat means — chosen deliberately, never by default.

## Use When
- Designing coverage for a scene during shot listing or the current storyboard.
- Storyboards need camera specifications per panel.
- A shot reads emotionally flat or contradicts its beat's function.

## Inputs

Read the current 剧本.md, 分镜.md, 视觉设定.md and the relevant actual reference frames or clips. Keep existing scene and shot IDs. A project may already use structured files, but this skill does not require YAML, an external schema or another toolchain's commands.

## Process
1. Read the beat's function and tension; camera choices must serve them.
2. Choose size per beat: EWS/WS for context and isolation-in-space, MS for
   relationship and body language, MCU for intention, CU for decision, ECU for
   detail that carries plot. Match scale changes to the beat; an opening close-up or early peak can serve a deliberate reveal.
3. Choose angle and height: eye level for neutrality, low to empower or loom,
   high to diminish or map, dutch only when the world itself tilts. Default
   height can follow the subject's eye level; choose a higher or lower view when the adopted perspective calls for it.
4. Choose the lens by its argument, from inside the project lens kit:
   ultra-wides (<24mm) are for vistas and scale — they distort faces at close
   range; 28–35mm is the workhorse wide that embeds the subject in context
   and survives tight spaces; 50mm can give a familiar field of view on full frame; longer lenses from a greater camera distance can give compressed close-ups; 100mm+ can help layer planes for
   isolation and surveillance. Declare depth of field when it argues
   (shallow isolates, deep focus keeps both planes in play). Keep matched reverses coherent; change lens or camera relation when the adopted dramatic design calls for it, and record the intended effect. Existing project lens constraints still apply.
5. Motivate movement or lock it off: push-in for realization, pull-back for
   revelation of context or abandonment, pan/track to follow intent, handheld
   for instability, dolly-past for time and detachment. Unmotivated movement
   is noise; static is a choice, not an absence.
6. Compose the frame to the beat: thirds with looking room as the default;
   deny the looking room (short-siding) when comfort must break; center and
   mirror when the scene benefits from symmetry; negative space as
   threat or absence; frame-within-frame for entrapment; headroom tightening
   as tension rises. Record the intended composition in the existing shot description; use `camera.composition` only if the project already has that field.
7. Pick the coverage pattern from blocking: master + matched singles for
   dialogue; shot-reverse-shot with readable eyelines and coherent camera relations;
   dirty OTS to keep power relations in frame; clean singles to isolate a
   character who is emotionally alone.
8. Specify each camera fully — size, angle, height, lens, movement, and the
   nearest mapped location angle — so shots are generable and auditable.
9. Check the set as a whole: sizes should progress with the scene's tension
   curve, and inspect adjacent same-subject cuts for unintended jumps; an intentional jump cut is valid when it serves the sequence.

## Outputs

Return adopted camera or sequencing decisions to the same 分镜.md or existing shot cards. Preserve stable IDs, source scene, start/end state and reference duties; do not create a parallel shot index.

## Quality Bar
- Every camera choice is justified by beat function, not habit.
- Matched reverses preserve intended relations; justified asymmetry may express a power change.
- Movement always has a stated motivation.
- Lens and coverage choices respect the style bible's lens bias.

## Common Failure Modes
- Defaulting everything to a medium shot at eye level on a 35mm.
- Escalating to close-ups early, leaving nowhere to go at the climax.
- Unmotivated changes in lens or camera distance that disrupt the intended reverse-pair relationship.
- Camera movement added for production value with no dramatic trigger.

## Notes
Cinematography decides what each shot is; `shot-sequencing` decides how shots
follow each other. Size/lens grammar established here is what continuity audits
treat as intent.

Choose the fewest shots that serve the current beats. Density, symmetry, lens changes and matched reverses are creative choices, not quotas or automatic approval gates. Preserve intentional deviations when they remain readable.
