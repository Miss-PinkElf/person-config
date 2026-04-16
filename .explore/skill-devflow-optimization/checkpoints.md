# Checkpoints

## 2026-04-09 / Checkpoint 001

- 当前阶段：Checkpoint / Handoff
- 本轮完成内容：
  - 完成 `devflow` 的设计讨论与收口。
  - 产出简体中文设计 spec：`docs/superpowers/specs/2026-04-09-devflow-design.md`
  - 产出实现 plan：`docs/superpowers/plans/2026-04-09-devflow-implementation.md`
  - 创建第一版 `.codex/skills/devflow/`
  - 修正复制子技能中的旧语义、旧路径和模板断链。
- 本轮决策与原因：
  - 采用 `devflow` 新 skill，而不是继续原地膨胀旧 skill。
  - 采用“薄主入口 + 多子技能”。
  - 采用 `.devflow/<mission-slug>/` 工作区。
- 本轮沉淀经验：
  - 新总入口 skill 的第一版重点是主线自洽，不是一次性做完整迁移方案。
- 待解决问题：
  - 还未做真实任务 smoke test。
  - 还未设计旧 skill 的迁移兼容层。
- 下一步：
  - 通过真实任务验证 `devflow` 的轻量 / 重型 / bug / resume 路由。
- 可以从活跃上下文移除的内容：
  - 大部分前期讨论取舍已沉淀到 spec、plan 和 `.explore/skill-devflow-optimization/`。

## 2026-04-16 / Checkpoint 002

- 当前阶段：Checkpoint / Handoff
- 本轮完成内容：
  - 系统回读了原始 `devflow` 定位，并按原始分工重新校正优化方向。
  - 将 `superpowers-*` 子技能补到接近原版强度，并补齐相关 prompt / reference 文件。
  - 将 `openspec-*` 收口为更纯的生命周期控制器，强调进入条件、退出条件、回退与委派。
  - 收敛 `devflow` 外层，让主 skill 更明确只负责调度、记录与恢复。
  - 将 `devflow` 内置 `session-handoff` 恢复顺序改为先读 `state.md` 与最新 `checkpoint`，再把 handoff 作为补充恢复入口。
  - 按最新状态更新 `.explore/skill-devflow-optimization/` 和 `NEXT-SESSION-PROMPT.md`。
- 本轮决策与原因：
  - `superpowers-*` 优先恢复原版强度，因为之前的问题主要来自精简过度。
  - `openspec-*` 只做生命周期优化，不抢质量方法论。
  - `devflow` 外层不再继续加厚，而是开始收敛回调度器定位。
- 本轮沉淀经验：
  - 先回读原始版本，再优化当前版本，能避免越改越偏。
  - 当技能体系开始稳定后，应尽快从“文档改写”切换到“eval 与真实场景验证”。
- 待解决问题：
  - 还未做真实任务 smoke test。
  - 还未做 `skill-creator-cc` 风格的最小 trigger / workflow eval。
  - `devflow` 与 `context-budget-explore` / `spark-workflow` 的边界还没有用真实 prompt 验证。
- 下一步：
  - 准备最小 eval prompt 集。
  - 轻量 / 重型 / resume 三类场景各走一遍 `devflow`。
  - 根据真实验证结果决定是否继续改文档或开始设计迁移策略。
- 可以从活跃上下文移除的内容：
  - 关于 `openspec-*` 是否应该承担思考质量、`devflow` 外层是否继续加厚的争论，已经有明确结论并沉淀到文档。
