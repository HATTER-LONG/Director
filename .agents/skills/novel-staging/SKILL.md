---
name: novel-staging
description: 为复杂双人或群戏设计开场站位，按需交付可拖动的 HTML 平面报告。输入可来自当前 Markdown 剧本和场景图；工具 JSON 是派生工作数据，采用的走位句回填原分镜。
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - Glob
metadata:
  version: 1.0.1
  license: Apache-2.0
  requires:
    bins:
      - node          # >= 18，只用标准库，无 npm 依赖
  runtimes:
    - claude-code
    - codex
---

## novel-staging

为需要明确调度的场次安排开场站位：每个人在哪件东西旁、坐还是站、面朝哪里。

复杂站位只靠文字不易核对时，用俯视平面检查人物、家具和通路，或让用户拖动调整。简单场次直接在分镜中写清即可。报告帮助设计与核对空间，生成结果是否遵守站位仍需检查样片。

| 交付 | 解决什么 |
| --- | --- |
| 认图结果（每个地点 4–20 件东西） | 站位只落在图上真有的东西旁——提示词里写了、图上没画的高台，人坐上去，每段视频都不一样 |
| 俯视平面 | 在透视的场景图上「桌子北侧」只是桌子后面一小条，前后深浅说不清；摆平了从上往下看，方位一目了然 |
| 开场站位（每场） | 谁开场就在、谁后来才进；坐还是站跟着剧本；主位、对立、孤立用位置说出来 |
| 开场走位句 | 程序按站位写，一字不差交给分镜：「胡二爷坐在第三排坐板上，面朝北；其余座位空着，没有其他人。」 |
| 能调整的报告 | 人在页面上拖动、改坐站和朝向，改完导出就是新的 staging.json，不用手改 JSON |

`{baseDir}` = 本文件所在目录。脚本 `{baseDir}/scripts/novel-staging.mjs`，零依赖，`node` 直接跑。

**边界（不做的事）**：不写分镜、不写剧本、不出图。只管**开场那一刻**——中途谁站起来、走到哪，是分镜的事，分镜从这一刻往后接着写。

---

### Step 0 — 定输入

先读当前剧本、视觉设定和已有场景图。Director 的 Markdown 项目按 [Markdown 输入适配](references/markdown-input.md) 提取临时 `script.json`，以及可选的地点/姓名映射；已有兼容 JSON 则复用。无需安装 novel-script、novel-art 或 novel-outline。

JSON 记录来源文件和场号映射，只是本次工具输入，不反向覆盖剧本。采用的开场走位句回填原分镜；HTML 与 staging.json 记录生成依据，源文档变化时重新提取受影响部分。场景图沿用实际文件及构图，不假定设定板一定四宫格或主图一定在左上。

### Step 1 — seed 骨架

```bash
node {baseDir}/scripts/novel-staging.mjs seed <script.json> --art <art.json> --outline <outline.json> > <workdir>/staging.json
```

确定性搬运：地点（按第一次出现的顺序）、每一场的集号场号、在哪个地点、光照时段、出场人物，每个人一条空的站位。**这些事实不要让模型重新想一遍。** 只要其中几集就加 `--eps 1-3`。

### Step 2 — 认图（每个地点一次）

每个地点一份任务，能并发就并发。读 `{baseDir}/references/read-pass.md`，照着做：看场景图的主视角，认出人会站在旁边、坐在上面的东西，每件写名字、另一种语言、图上的框（`box`）、平面上的位置（`plan`）、能不能坐（`on`）、是不是圆的（`round`），4–20 件，`readFrom` 写 `picture`。

最重的两条：**图里看不到的不写**（提示词里有、图上没有的一律不写）；**`plan` 按透视推算**，不是照抄 `box`。

**还没有图**：按当前视觉设定中的空间锚点和主视角说明推算，`readFrom` 写 `prompt`、不写 `box`。报告会标出来；图出来以后重新认一遍、核对站位。

### Step 3 — 排站位（每场一次）

每场一份任务，能并发就并发（同一个地点连着几场的，按顺序排，保持位置连贯）。读 `{baseDir}/references/staging-pass.md`，拿这一场的剧本、出场人物和这个地点认出来的东西，给 `places` 里每个人填：开场在不在（`present`）、在哪件东西（`item`）的哪一侧（`side`）、沿这一侧多远（`along`）、坐还是站（`posture`）、面朝哪（`facing`）；再填群演（`extras` / `extrasWhere`）和一句 `why`。

最重的三条：**后来才进来的人开场不在**；**剧本没写有别人就没有群演**；**只使用认出来的那些东西**。

### Step 4 — 校验 ⛔ 不能跳

```bash
node {baseDir}/scripts/novel-staging.mjs validate <staging.json> --script <script.json> --art <art.json>
```

8 道质量门全是代码：每个地点认了图且 4–20 件、东西的名字不重复且框合法（按图认的必须有 `box`）、每一场的地点都有认图结果、出场人物不多不少（给了 `--script` 还核对跟剧本一致）、每个人都定了在不在场且至少一人在场、在场的人落在认出来的东西上且方位坐站朝向合法、同一侧不叠人、群演人数是整数且写明在哪。

**有违规逐条修，改完重跑，直到通过。**

### Step 5 — 默认交付 HTML 工具报告

```bash
cd <输出目录>
node {baseDir}/scripts/novel-staging.mjs render staging.json > staging-report.html
```

**默认主交付是 `staging-report.html`，完成后直接给用户报告链接或路径，不要只返回 JSON、Markdown 或一段聊天摘要。** `render` 不指定格式时直接输出 HTML，显式 `--html` 仍然支持。`staging.json` 作为工作数据保存，供校验、再次渲染和后续交接；仅在用户需要文本版时执行 `render staging.json --md > staging.md`。

`staging-report.html` 双击就能开，每一场一张俯视平面：

- **拖动**一个人换位置，松手时落在最近那件东西最近的一侧；拖回下面的托盘就是开场不在，从托盘拖进来就是在场
- **点一下**一个人，调整坐着／站着、朝向（八个方位）
- 群演加减、写在哪；开场走位句和这一场的检查跟着实时更新
- 改动存在浏览器里，刷新不丢；**「导出 JSON」**下载改过的 staging.json

把导出的文件覆盖回 `staging.json`，**再跑一次 Step 4**。报告界面默认中文，`--lang en` 出英文界面（走位句改用认图时写的另一种语言名字）。图在别处就用 `--images <目录>` 指过去。

用户也可以用一句话要求调整（「把胡二爷挪到船头」）：照 `staging-pass.md`「按一句话调整」改，只动说到的人，再校验。

### Step 6 — 交给分镜

```bash
node {baseDir}/scripts/novel-staging.mjs blocking staging.json            # 每场一行：场次 + 开场走位句
node {baseDir}/scripts/novel-staging.mjs blocking staging.json --lang en  # 英文
```

将采用的开场走位句回填现有分镜；后续镜头按剧情继承或改变站位。使用原生 novel-storyboard 的项目可写入 `blocking`，Director 的 Markdown 项目沿用原有镜头卡，不另建 storyboard.json。

先提供 HTML 工具报告链接或路径，再用一句话说清：几个地点（几个按图认的、几个按提示词推算的）、几场、几场有人开场不在、群演多少；没过的门明说。JSON 是配套工作数据，Markdown 不是默认交付项。

最终落地：

```
<输出目录>/
├── staging-report.html            ← 默认主交付，双击打开，拖动调整并导出 JSON
├── staging.json                   ← 工作数据，供校验、渲染和后续交接
└── images/                        ← 本 skill 不写这个目录
    └── <地点名>-sheet.png          ← novel-art 的场景设定图放这儿，认图和报告都使用它
```

---

## 原生 JSON 管线

下图用于已有对应 JSON 文件的项目。Director 的 Markdown 输入与回填按 Step 0 和 Step 6 处理。

```
novel-outline    → outline.json （人物名字）
novel-art        → art.json     （地点 + 场景图）
novel-script     → script.json  （每一场谁出场、怎么演）
novel-staging    → staging.json （每一场开场谁在哪）
novel-storyboard → storyboard.json（每一场第一段的开场走位照抄 staging）
```

seed 吃 script.json，`--art` 给地点名字，`--outline` 给人物名字。novel-storyboard 目前**不自动读** staging.json：使用 `blocking` 命令打出的句子，写进分镜每场第一段的 `blocking`。

## 边界

- 只排开场那一刻；中途换位置归分镜
- 本 skill 不出图；复用当前项目的场景图，工具输入记录真实路径
- 方位一律按场景说（东南西北、在哪件东西旁），不按画面说（左右）——画面左右由机位推出，机位一换就翻

## 自测

```bash
node {baseDir}/scripts/selftest.mjs
```

99 项断言，不调模型、不花额度。8 道质量门每一道都有击穿用例；平面几何、拖动落点、走位句、seed、报告（中英界面、转义、嵌图）都覆盖；还会单独拿嵌进页面的那份算法的源码重建一份，核对跟命令行算的一样。改完脚本先跑这个。

## 自带样例

`{baseDir}/examples/渡口-staging.json`：《渡口》三个地点（渡口栈桥、渡船船舱、对岸芦苇滩）、九场的开场站位，全部质量门通过（对着样例剧本和美术）。样例没有场景图，三个地点都是按设定提示词推算的（`readFrom: prompt`）。当质量基准，也是自测夹具。
