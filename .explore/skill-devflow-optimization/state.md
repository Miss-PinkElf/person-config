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
- `superpowers-*` 子技能已补到接近原版强度，并补齐了相关 prompt / reference 资源文件。
- `openspec-*` 子技能已按“OpenSpec 管阶段推进”的原则收口，强调生命周期边界、进入条件、退出条件与回退点，不再扩张为质量方法论。
- `devflow` 外层已做一轮收敛，重新强调“OpenSpec 管阶段推进，Superpowers 管思考质量，DevFlow 管主线记录、路径调度与恢复。”
- `devflow` 内置 `session-handoff` 已改成恢复时优先读取 `state.md` 与最新 `checkpoint`，handoff 作为补充恢复入口。

## 工作假设
- 当前 `devflow` 已不适合继续大幅加厚文档，下一轮最有价值的工作是做真实任务 smoke test 与触发 / 路由验证。
- 如果验证时发现问题，优先修正主入口规则、路径引用与子技能边界，不急着做迁移兼容层。
- `skill-creator-cc` 视角下，当前版本已经进入“应该开始 eval，而不是继续纯手工改文案”的阶段。

## 待解决的问题
- `devflow` 还没有经过真实任务 smoke test。
- 还没有做 `skill-creator-cc` 风格的最小 eval：包括 trigger eval 与 workflow eval。
- `devflow` 与 `context-budget-explore` / `spark-workflow` 的触发边界还没有用真实 prompt 验证。
- 旧 `context-budget-explore` 和新 `devflow` 的迁移关系仍未设计。
- `context-budget-explore` 自己的内置 `session-handoff` 仍是旧的“优先读最新 handoff”逻辑，本轮未同步优化。

## 下一步
- 先按 `skill-creator-cc` 的思路，准备一组最小高价值 eval prompt，覆盖：
  - 应该触发 `devflow`
  - 不应该触发 `devflow`
  - `devflow` 与 `context-budget-explore` / `spark-workflow` 的冲突边界
- 用一个轻量任务、一个重型任务、一个 resume 场景各走一遍 `devflow`，检查：
  - 路径判断
  - Align -> Plan -> Propose / Apply 顺序
  - `state` / `checkpoint` / `handoff` 链路
- 若验证稳定，再决定是否继续优化其它主 skill，或开始设计迁移策略。

## 最新 handoff
- `handoffs/2026-04-16-002-rest-ready.md`

## 最小活跃上下文摘要
- 当前已经不需要重新讨论 `devflow` 的基本定位；这一层已经收口。
- 当前最重要的是停止继续加厚 skill 文档，转入真实场景验证与最小 eval。
- 如果下轮继续修改，优先动的是验证数据、触发边界和真实 workflow，而不是再大段改写理论说明。
