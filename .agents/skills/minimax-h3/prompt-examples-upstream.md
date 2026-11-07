# 上游提示词示例快照

仅用于了解原运行手册的示例。Director 的正式格式与项目差异统一读取 h3-prompt-writing；下面的时间戳和结束符不是当前项目默认值。

## The prompt format is not free-form prose

H3-Base consumes the output of a hosted prompt refiner (**H3-Context-IR**) that is **not** in the open release.
So locally you write in the refiner's output shape yourself. From MiniMax's own
`VIDEO_PROMPT_WRITING_GUIDE_base_en.md`, that is an optional instruction line, a blank line, then three fields:

```
integrated_multimodal_description: [Shot 1] ... [Shot 2] At 00:04.500, ...

overall_soundscape: ...

non_diegetic_music: ...
```

- `integrated_multimodal_description` carries visuals, action, shots, speakers, dialogue and diegetic sound along
  the timeline. `overall_soundscape` sums ambience and physical-action sound. `non_diegetic_music` is score the
  characters cannot hear.
- **Image modes need a fixed first line.** I2V: `For the target video, at 0.00 seconds into the target video,
  <Picture 1> (from [Shot 1]) is fully referenced.` First-and-last-frame uses the alignment sentence naming both
  pictures and the second each lands on, to two decimals.

### A complete prompt, end to end

Nothing above is usable until you have seen one whole. This is a 5 s text-to-video brief in the official shape:

```
integrated_multimodal_description: [Shot 1] Cinematic medium-wide shot, Push In slowly. A bicycle mechanic in
a navy work coat lowers a metal shutter in a narrow workshop at dusk; warm tungsten light spills across
scattered tools and rain-dark pavement outside. He pauses, looks toward the street. At 00:03.200 he switches
off the bench lamp and the frame drops to ambient blue. The mechanic (weathered voice, mid-fifties, speaks
English only) says quietly: <d>[English] That's enough for today.</d>

overall_soundscape: Steady rain on a metal awning, the rolling clatter of the shutter, one soft click of the
lamp switch, distant tyres on wet asphalt. No music from within the scene.

non_diegetic_music: Sparse solo piano, slow, minor key, entering after the shutter closes and fading to
silence on the lamp click.
```

For **image-to-video** the same block is preceded by the fixed line and one blank line:

```
For the target video, at 0.00 seconds into the target video, <Picture 1> (from [Shot 1]) is fully referenced.

integrated_multimodal_description: [Shot 1] ...
```

Note what is doing the work: one physical action the camera and the sound can both follow, a camera move from
the fixed vocabulary, the spoken line wrapped in `<d>` so the words are exact, and the two audio fields kept
separate so diegetic sound and score do not fight.
