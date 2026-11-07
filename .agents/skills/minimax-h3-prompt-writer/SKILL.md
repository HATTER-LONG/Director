---
name: minimax-h3-prompt-writer
description: 诊断和修复 H3 的参考绑定、对白、声音、续镜及不同运行入口差异。最终提示词格式由 h3-prompt-writing 维护；本技能提供专项排障资料和离线校验器。
---

# H3 提示词诊断与校验

已有提示词或输出出现具体问题时使用。最终语法统一由 [h3-prompt-writing](../h3-prompt-writing/SKILL.md) 维护，Director 应用其项目差异；本技能不另立格式。需要改动镜头设计时交 [h3-cinematic-director](../h3-cinematic-director/SKILL.md)，本地节点故障交 [minimax-h3](../minimax-h3/SKILL.md)。

## 排查步骤

1. 核对本版分镜、完整提示词、实际参考顺序、部署模式和失败产物，定位问题出现的时间与画面或声音证据。没有看过、听过的部分标为未验证。
2. 区分来源矛盾、参考用途不明、格式错误、运行能力不匹配和待验证的模型倾向。素材编号、主体编号与说话人编号分别核对。
3. 只读取下表中命中的资料，保留已成功的属性，先修有证据支持的原因。参考图不自动锁定首帧，文字指令不保证像素、切点或音轨完全一致。
4. 按格式入口重新编译完整版本，再校验。保留原对白、创作意图和不受影响的参考；台词放不下时回分镜调整，不静默缩句。
5. 在已授权范围验证结果，记录改了什么、看到了什么和仍未知什么。文本检查通过不等于成片通过。

## 按问题读取

| 问题 | 资料 |
| --- | --- |
| Director 的实际端口与参数 | [部署能力](../../../docs/workflow/references/local-model-capabilities.md) |
| 其他入口、参考角色或混合输入 | [capabilities.md](references/capabilities.md)，以当前入口为准 |
| 对白、声线、音轨复用、歌唱或声音连续性 | [audio.md](references/audio.md) |
| 参考保留、视频编辑与接续 | [editing-brief.txt](references/editing-brief.txt) |
| 托管服务会改写用户提示词 | [freeform-en.txt](references/freeform-en.txt) |
| 已出片问题与评估 | [troubleshooting.md](references/troubleshooting.md)；反复补丁见 [共性排查](../../../docs/workflow/references/h3-prompt-diagnosis.md) |
| 需要针对题材的设计例子 | [direction.md](references/direction.md) 或 [examples.md](references/examples.md)，按当前问题选择 |
| 技术说法的来源与时效 | [sources.md](references/sources.md) |
| 社区 LoRA、控制与长视频实验 | [experimental-local.md](references/experimental-local.md)，仅用于相关本地实验，不作为能力保证 |

## 离线校验

使用 `scripts/lint_prompt.py`。`profile`、`timing`、模式和有效时长与编译设置一致；参数选择和命令示例统一见 [Director profile](../h3-prompt-writing/references/director-profile.md#编译与校验用同一模式)。语速提示是检查线索，不是模型上限。

按请求交付修订提示词或带证据的问题说明。模式、参考顺序和运行参数放在生成正文之外；来源中没有的台词、文件和运行结果不得补造。
