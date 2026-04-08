# 当前状态

## 当前阶段
- Checkpoint / Handoff

## 已确认的事实
- 用户已经明确：新 skill 采用 `devflow` 命名，先新建，不迁移旧 skill。
- 新 skill 的定位已确定为“薄主入口 + 多子技能”，而不是继续保留中间调度层。
- 新 skill 的工作区规则已确定为 `.devflow/<mission-slug>/`。
- 路径规则已确定为轻量 / 重型 / bug / resume 四类，并采用“系统先判断 + 用户可覆盖”。
- 核心记录策略已确定为“核心文件默认创建，阶段文件懒创建”。
- `checkpoint` 与 `handoff` 的分工已明确：checkpoint 负责阶段快照，handoff 负责正式交接。
- `plan != spec` 已被明确收口为硬规则。
- 简体中文设计 spec 已写入 `docs/superpowers/specs/2026-04-09-devflow-design.md`，并已单独提交。
- 第一版 `devflow` 已创建在 `.codex/skills/devflow/` 下，包括：
  - `SKILL.md`
  - `references/`
  - `assets/templates/`
  - `skills/` 中复用并改写后的 OpenSpec / Superpowers / session-handoff 子技能
- 实现 plan 已写入 `docs/superpowers/plans/2026-04-09-devflow-implementation.md`，尚未单独提交。

## 工作假设
- 当前第一版 `devflow` 已经足够进入下一轮真实任务验证。
- 下一轮最有价值的工作不是继续堆文档，而是做一次真实触发 / 路由 / 记录链路验证。
- 如果验证时发现问题，优先修正主入口规则与子技能引用，不急着做迁移兼容层。

## 待解决的问题
- `devflow` 还没有经过真实任务 smoke test。
- 复制过来的子技能虽然已做路径与语义改写，但还没逐个深度审校。
- 旧 `context-budget-explore` 和新 `devflow` 的关系目前只在设计层明确，尚未做迁移策略。
- 是否需要进一步压缩 `devflow/SKILL.md` 或拆更多参考文件，还没有经过实际使用验证。

## 下一步
- 先用一个小型任务和一个中型任务各走一遍 `devflow`，检查路径判断、plan/spec、记录与 handoff 是否符合预期。
- 重点检查 `session-handoff`、`openspec-propose`、`openspec-explore` 在 `devflow` 语境下是否还有残留旧假设。
- 如果链路稳定，再考虑是否提交第二轮优化，或开始设计旧 skill 的迁移方案。

## 最新 handoff
- `handoffs/2026-04-09-001-rest-ready.md`

## 最小活跃上下文摘要
- 当前已经完成设计与第一版实现，不需要重新从需求讨论开始。
- 当前最重要的是验证第一版 `devflow` 能不能在真实任务里稳定使用。
- 本轮收尾的核心目标是把状态、风险、下一步和提示词全部写清楚，方便直接续接。
