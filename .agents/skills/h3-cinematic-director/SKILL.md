---
name: h3-cinematic-director
description: 设计或修复 H3 镜头的站位、表演、摄影、动作终点与连续性。用于需要导演判断的镜头设计或单变量返工；最终格式交 h3-prompt-writing，节点和模型问题交 minimax-h3。
---

# H3 Cinematic Director

Director 当前本地模式、参数与跨段接法统一见 [部署能力](../../../docs/workflow/references/local-model-capabilities.md)，通用模式说明不覆盖实际适配器。构图、参考和状态变化反复跑偏时，按 [共性问题排查](../../../docs/workflow/references/h3-prompt-diagnosis.md) 定位原因。

## Purpose

Operate as one explicit, self-contained application for four jobs:

1. `shot-design` — turn an approved dramatic beat into necessary, motivated shots.
2. `h3-prompt` — translate an approved shot into the exact MiniMax H3 prompt schema.
3. `continuity-audit` — compare neighboring shots, keyframes, and assets for continuity failures.
4. `single-variable-repair` — repair one failed variable without redesigning the approved shot.

Treat director vocabulary as an internal design layer. Compile through h3-prompt-writing and the Director profile; do not maintain a competing output format.

## Invocation

The user may call the skill directly with:

- `$h3-cinematic-director shot-design: ...`
- `$h3-cinematic-director h3-prompt: ...`
- `$h3-cinematic-director continuity-audit: ...`
- `$h3-cinematic-director single-variable-repair: ...`

If no application is named, infer the smallest applicable job from the request. Do not widen the task into story rewriting unless requested.

## Information Boundary

- Use story, assets, and decisions from the current project and authorized task context.
- Reuse method, terminology, and checklists; never reuse project-specific names, dialogue, plot beats, shot content, images, or private prompts.
- Treat approved script and approved assets as canonical. Flag contradictions instead of silently inventing replacements.
- Do not add plot, characters, props, effects, dialogue, or cuts merely to make an image more spectacular.

## Core Principle

Translate dramatic intention into visible and audible evidence:

`dramatic purpose → spatial blocking → performance → camera → edit → sound → H3 control`

Every instruction must be observable or measurable. Replace vague language such as “cinematic,” “emotional,” or “dynamic” with subject position, action, muscle response, camera path, focal behavior, light source, material behavior, timing, and sound.

## 按需阅读

需要设计或修复空间、接触、取景、环境与动作编排、特效或竖屏遮挡时，读 [镜头描述](references/shot-description.md) 的对应章节。只改格式时直接交 h3-prompt-writing。采用的导演结论回填当前分镜，不建立平行镜头事实。

## Workflow

### 1. Lock the approved beat

Before designing or prompting, state internally:

- what changes in information, power, emotion, relationship, danger, or space;
- where the previous shot ends and this shot begins;
- the character objective and immediate obstacle;
- the required end state that enables the next shot.

If the shot changes none of these, check whether holding the image serves performance, tension or rhythm. Remove only an insert that has no useful function.

### 2. Build the continuity ledger

Record only relevant hard facts:

- character identity, silhouette, proportions, face, hair, eyes, costume, footwear, carried props;
- prop state, hand occupancy, damage, open/closed state, display content;
- scene geography, entrance/exit, horizon, floor level, landmark positions, screen direction;
- time, weather, key-light direction, color temperature, atmosphere;
- start pose, end pose, gaze, weight center, contact point, pain or fatigue state;
- sound already active before the cut and sound that must bridge out.

Classify facts as `hard continuity`, `soft continuity`, or `expressive variation`. Never sacrifice hard continuity for decorative detail.

### 3. Choose the generation mode

- `T2VA`: use for an authorized text-only task; do not switch to it merely because a required reference is missing.
- `I2VA`: use one approved first frame when the action develops forward with moderate change.
- `FL2VA`: use approved first and last frames for continuous movement or visible state change.
- `L2VA`: use one approved last frame when the shot must converge precisely on it.
- `Ref2VA`: use the selected workflow's reference inputs, including a single image in the current local workflow, to guide identity, environment, props, action, camera, style, or voice.

Use the actual selected node and workflow to identify available modes, checkpoints and reference roles. Do not select or replace a model from an embedded filename preference. Read minimax-h3 only when runtime capability needs checking.

### 4. Assign each reference one job

Use a small hierarchy:

1. canonical identity and costume;
2. environment geometry and light;
3. prop structure and state;
4. action pose or motion timing;
5. camera movement;
6. style or color treatment;
7. voice or audio.

Assign explicit roles and scopes to each reference. One complete image may supply several compatible facts; do not force its pose or framing onto the shot when it is only an identity or layout reference. Resolve conflicts against the approved scene and shot, rather than applying one fixed reference priority to every shot.

Use one canonical facial source whenever possible. Use front, profile, and rear sheets to support rotation, not to create competing identities.

### 5. Plan the shot in director controls

Choose the controls needed for the shot before writing H3 fields; this is not a mandatory field-filling template:

- `location map`: foreground, midground, background, entrances, exits, landmarks, left/right relations;
- `opening state`: the initial visible state and framing are clear and compatible with the incoming cut; a reference image does not lock the first frame;
- `format`: aspect ratio, effective duration, one shot or ordered cuts; exact cut times only when explicitly required;
- `optics`: FOV or lens feel, camera height, distance, depth of field, focus targets;
- `camera`: one motivated movement with direction, amplitude, speed, and stopping point;
- `action`: intention, anticipation, exertion, contact/near-miss, reaction, recovery, consequence;
- `performance`: gaze, breath, jaw, shoulders, hands, weight shift, hesitation, protective motion;
- `physics`: gravity, momentum, contact, balance, cloth drag, hair follow-through, material deformation;
- `lighting/color`: relevant source direction, contrast, palette and material response; use numerical values only when established and useful;
- `sound`: ambience, synchronous foley, voice, subjective sound, silence, non-diegetic score;
- `positive locks`: elements that remain stable through the shot.

Load [references/director-keywords.md](references/director-keywords.md) when the user asks for camera keywords, director language, or a high-control prompt.

### 6. Design the shot or shot group

Record the relevant decisions in the existing storyboard; do not expand every shot to include every item below:

- shot number and duration;
- dramatic purpose;
- framing, camera position, FOV/lens feel, and camera height;
- composition, depth layers, screen direction, and gaze;
- start state, action phases, end state;
- performance and physical feedback;
- camera movement and focus behavior;
- cut or keyframe connection;
- lighting, color, diegetic sound, dialogue, and music;
- H3 mode, checkpoint, reference labels, and known risk.

Continuous action may use multiple storyboard frames under one shot number. Label them `S17-A`, `S17-B`, `S17-C` or equivalent; do not mislabel every action phase as a new editorial shot.

### 7. Compile through the format owner

Use [h3-prompt-writing](../h3-prompt-writing/SKILL.md) for the selected mode and Director profile. Put the approved camera, performance and sound decisions into its fields; do not define a second schema here. Match the actual reference order and effective duration, and preserve the source dialogue and visible text.

### 8. Audit before delivery

Load [references/continuity-audit.md](references/continuity-audit.md) and reject or repair the output when:

- the action cannot be understood without explanation;
- the shot lacks a motivated dramatic purpose;
- a character, prop, or scene element appears, disappears, mirrors, duplicates, or changes state without cause;
- the camera crosses the axis or loses the intended geography;
- force, pain, balance, contact, or recovery is physically false;
- the required opening or end state, or the assigned reference role, is not respected;
- a cut breaks gaze, motion, light, sound, or screen direction;
- timing exceeds the available duration;
- sound contradicts the image or masks essential dialogue.

## Application Outputs

### shot-design

Lead with a continuity note, then a compact shot table. Explain why each shot exists and how it connects to neighboring shots. Do not write H3 prompts unless asked.

### h3-prompt

Output the copy-ready H3 prompt first. Follow with a concise production note listing mode, checkpoint, duration, reference roles, and high-risk variables.

### continuity-audit

Return:

1. `passing items`;
2. `hard continuity errors`;
3. `shot logic errors`;
4. `model generation risks`;
5. `minimal repair plan`.

Do not redesign passing elements.

### single-variable-repair

State the failed variable and preserve approved story and shot decisions. For a local defect, replace the affected clause and read the whole prompt for contradictions. If accumulated patches conflict, consolidate the current prompt against the storyboard. Identify an incorrect source reference when that is the cause.

## Repair Discipline

- Prefer one main hypothesis per comparison. Clear proven contradictions together when necessary, record all changed inputs, and do not attribute a multi-variable improvement to a single cause.
- Prefer positive locks in the main description: “the same coat remains fastened,” “the doorway stays frame-left,” “the prop remains in the right hand.”
- Add a brief exclusion only for a demonstrated risk relevant to this shot. Prefer a clear positive state or action over a generic list of prohibitions.
- If a remote face is too small to carry emotion, preserve identity through silhouette, hair, costume color, and posture, then cut closer when emotion matters.
- If several NPCs appear, specify diversity by age, face shape, hair, clothing, body type, occupation, color, and behavior; never rely on “a varied crowd.”

## Non-Negotiable Quality Bar

- A shot is an instruction about audience attention, not a decorative image.
- A camera move must reveal, follow, compress, release, isolate, destabilize, or transfer attention.
- A close-up must reveal information, vulnerability, thought, or power.
- A transition effect must inherit the destination world's visual and sonic rules while retaining cross-world identity anchors.
- H3 prompt precision never overrides approved story logic.
- Never expose private source material while teaching or packaging this method.
