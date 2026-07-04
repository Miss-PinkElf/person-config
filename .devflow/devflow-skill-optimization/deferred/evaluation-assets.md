# 评测资产（Evaluation Assets）

## 暂不做的对象

为 `devflow` 技能（DevFlow skill）建设正式评测资产（Evaluation assets），包括触发测试、流程门禁测试和恢复路径测试。

## 本轮不做的原因

本轮已按方案 B 收敛为顶层技能、references、templates、`devflow-handoff.md` 与当前 mission 记录更新。新增评测资产会扩大范围，并需要重新设计测试 prompt、评分标准和运行方式。

## 当前已有思路

- 使用真实 prompt 验证是否稳定触发对齐（Align）、计划（Plan）、实施（Apply）、验证（Verify）和收口（Close）。
- 构造 should-trigger / should-not-trigger 的描述触发（description trigger）样例。
- 结合 `skill-creator-cc` 的评测查看器（eval viewer）做人工审查。

## 后续触发条件

- 用户明确要求验证 `devflow` 触发效果。
- 真实使用中再次出现跳过 Align / Plan / Verify 的行为。
- 准备进一步优化技能描述（skill description）时。

## 推荐进入阶段

重型路径（Heavy Route） / Align。
