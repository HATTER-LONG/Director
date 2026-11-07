# 视觉设定阶段契约

本表的结构规则用于已采用五文档格式的项目，字段语法以 [交接格式](../../short-drama/references/creator-documents.md) 为准；其他项目保留同样的来源和状态要求，沿用原格式。授权与项目优先级见 [AGENTS](../../../../AGENTS.md#文档职责与规则来源)。

本阶段只拥有 `剧集/<EP>/视觉设定.md` 中的人物/造型、地点/视图、道具/状态、声音身份与跨场连续性。
它继承剧本事实，不决定镜头瞬态、构图、动作终点或生成提示词。

每个判断在同一文档中写成复用、新身份、新变体或真实未决；来源用场景 ID，跨文档消费用可见标题和
稳定 ID。不要为身份决定建立 occurrence、decision、ledger 或接受记录。

## 本阶段规则

### `AST`

| ID | Class | Knowledge |
|---|---|---|
| AST-01 | structural_invariant | Before creating or reusing an asset, point to the scene ID and visible evidence that establishes it. |
| AST-02 | reviewed_invariant | Reconcile each occurrence as reuse, new identity, new variant, or unresolved—never guess an ambiguous name/pronoun. |
| AST-03 | craft_default | Separate Character/Look, Location/View, and Prop/State. |
| AST-04 | reviewed_invariant | Persistent identifying anchors and mutable state are not mixed. |
| AST-05 | structural_invariant | Every downstream reference resolves to a visible identity item and the stated current variant in `视觉设定.md`. |
| AST-06 | craft_default | Track only asset facts needed for recognition, reuse, prompt writing, or continuity. |
| AST-07 | reviewed_invariant | Persistent voice identity and pronunciation refs stay separate from scene-level breath, emotion, volume, and delivery state. |
| AST-08 | reviewed_invariant | A voice reference binding states what it controls and what it must not; the take's emotion, its recording space, and its background never enter identity. |
| AST-09 | reviewed_invariant | A claim about what is audible in a reference requires a creator or rights-holder description, or an authorized listening observation bound to the inspected bytes; otherwise admission stays unverified. |
| AST-10 | structural_invariant | One accepted pronunciation of a proper noun uses one spelling throughout `视觉设定.md`. |
| AST-11 | reviewed_invariant | Characters designed together are not bound to confusable references; each names the audible trait telling it apart from its nearest neighbour, and names that character. |
| AST-12 | craft_default | Selection criteria are few, audible and counter-exampled; they judge a candidate reference or a clone result, they do not stand in for one. |
| AST-13 | structural_invariant | When the project's prompt language is not the language of the entry headings, every 人物 entry a shot's 视觉依据 references reaches a stated conclusion: `画面代称` carrying the exact spelling prompt bodies use, or `画面代称：无` when no body names it. One accepted name uses one spelling, case included. 地点/道具 declare one only when a body names them. |
| AST-14 | reviewed_invariant | The era shown in `视觉设定.md` and in the prompts projected from it does not contradict source facts—devices, platforms, slang, stated years. A retro or aged descriptor (旧/老式/复古/褪色/斑驳, old, worn, dusty, period, CRT) cites a source basis or an explicit creator choice. |
| AST-15 | craft_default | The project visual direction states explicit era anchors: the year or decade, and how devices, uniforms, furniture and lighting look in it. Location, costume and prop entries carry the era-specific form that image and video prompts copy. |

### `CON`

共同遵守 [跨阶段连续性 CON-01 至 CON-07](../../short-drama/references/contract-and-ownership.md#跨阶段连续性)。本阶段检查与其输出有关的状态和下游引用，规则正文只在该处维护。

规则分级由高到低：`structural_invariant`（结构缺陷，阻断）、
`reviewed_invariant`（需证据判断）、`craft_default`（常用做法，可覆盖）、
`taste_option`（创作者选择，不作缺陷）。创作者已接受的事实优先于本表。
