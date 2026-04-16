# 任务工作流

## 任务目标
- 为长任务记录与工作流能力设计并落地一个新的 `devflow` skill。
- 把记录、plan、spec、debug、verify、handoff 统一到新的主入口设计中。
- 在休息前把当前结果沉淀到 `.explore/`，便于下次直接续接。
- 在第一版成型后，通过真实任务与最小 eval 验证 `devflow` 是否真的可用。

## 范围边界
- 范围内：
  - 梳理并确认 `devflow` 的设计。
  - 产出简体中文设计 spec 与实现 plan。
  - 创建第一版 `.codex/skills/devflow/`。
  - 收口 `superpowers-*`、`openspec-*` 与 `devflow` 外层边界。
  - 更新 `.explore` 记录、handoff 和 `NEXT-SESSION-PROMPT.md`。
- 范围外：
  - 本轮不迁移旧 `context-budget-explore`。
  - 本轮不真正执行 `devflow` 的 smoke test。
  - 本轮不做 skill description 的自动 trigger 优化循环。

## 成功标准
- `devflow` 的设计边界明确。
- 第一版 `devflow` 目录、主入口、规则文档、模板、示例和复用子技能已创建。
- `openspec`、`superpowers`、`devflow` 外层职责边界已基本收口。
- 当前工作已通过 `.explore` 记录和 handoff 可恢复。
- `NEXT-SESSION-PROMPT.md` 已改为可直接续接本任务。

## 阶段规划
1. 读原始需求、旧 plan、OpenSpec / Superpowers 参考内容。
2. 通过 brainstorming 明确 `devflow` 的定位、路径、记录模型与目录结构。
3. 写设计 spec 和实现 plan。
4. 实现第一版 `devflow`。
5. 收口外层职责边界与子技能边界。
6. 做 checkpoint / handoff / prompt 收尾。

## 当前阶段
- Checkpoint / Handoff

## 退出条件
- 当前完成内容、风险、下一步已写入 `.explore/skill-devflow-optimization/`。
- 最新 handoff 已生成并登记。
- `NEXT-SESSION-PROMPT.md` 可直接复制使用。
- 本轮代码已提交并推送。
