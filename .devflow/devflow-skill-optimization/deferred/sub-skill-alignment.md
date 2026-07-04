# 子技能协同（Sub-skill Alignment）

## 暂不做的对象

检查并修正 OpenSpec / Superpowers 子技能（sub-skills）是否仍会违背 `devflow` 外层阶段门禁、记录生命周期和上下文预算规则。

## 本轮不做的原因

本轮目标是补齐顶层 `devflow` 技能（DevFlow skill）v0.4 记录生命周期规则。修改子技能会显著扩大影响面，并可能与现有 OpenSpec / Superpowers 生命周期规则产生冲突。

## 当前已有思路

- 优先检查 `openspec-apply-change` 是否仍要求 Apply 完成后无条件更新多个文档。
- 检查 `openspec-propose` 是否严格使用 `.devflow/<mission>/spec/`。
- 检查 `session-handoff` 是否与新的恢复热路径（Resume Hot Path）和 `state-history.md` 规则一致。

## 后续触发条件

- 真实使用中发现子技能输出与顶层 `devflow` 规则冲突。
- 用户要求继续优化子技能协同。
- 准备处理 `devflow-handoff.md` 普通收尾耗时问题。

## 推荐进入阶段

重型路径（Heavy Route） / Align。
