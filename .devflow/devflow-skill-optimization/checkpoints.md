# Checkpoints

## 2026-05-01 - handoff 耗时问题记录与分模式方案撤回

- 当前路径与阶段：bug 路径（Bug Route） / Verify
- 本轮完成内容：
  - 记录 `devflow-handoff.md` 普通收尾耗时约 20 分钟的问题到 `bug-log.md`
  - 曾尝试将 `devflow-handoff.md` 与内置 `session-handoff` 子技能拆成多模式
  - 用户确认暂时不优化 `devflow-handoff.md`，不引入多模式
  - 已撤回 `devflow-handoff.md` 与 `session-handoff` 子技能中的分模式改动
- 关键决策：
  - `devflow-handoff.md` 暂时保持原本直接交接流程
  - handoff 耗时问题保留记录，后续如继续优化需重新对齐方案
- 风险与阻塞：
  - 约 20 分钟耗时问题尚未解决
- 立即下一步：
  - 继续优先完成已确认的 `devflow` 技能上下文预算与总记录优化
  - 如要重新处理 handoff 性能，先讨论方案，不直接拆模式
- 相关文件与证据：
  - `devflow-handoff.md`
  - `.devflow/devflow-skill-optimization/bug-log.md`

## 2026-05-01 - `devflow-handoff.md` 适配上下文预算规则

- 当前路径与阶段：重型路径（Heavy Route） / Close
- 本轮完成内容：
  - 保留 `devflow-handoff.md` 原本直接交接流程，不引入多模式
  - 补充上下文预算（Context Budget）规则说明
  - 明确 `state.md` / `workflow.md` 使用滚动摘要（Rolling Summary）
  - 增加 `development-overview.md` 总记录（Overall Record）的按需更新项
  - 要求下一次提示词写明恢复热路径（Resume Hot Path）
  - 完成关键词搜索、checkpoint 窗口整理与 `git diff --check` 验证
- 关键决策：
  - `devflow-handoff.md` 需要适配 `devflow` 技能优化，但适配不等于拆分模式
- 风险与阻塞：
  - handoff 耗时问题仍未专门解决
- 立即下一步：
  - 等待用户确认是否需要提交代码
- 相关文件与证据：
  - `devflow-handoff.md`
  - `git diff --check`

## 2026-05-01 - 上下文预算（Context Budget）与总记录规则落地

- 当前路径与阶段：重型路径（Heavy Route） / Verify
- 本轮完成内容：
  - 按 `skill-creator-cc` 思路优化现有 `devflow` 技能（DevFlow skill），不是只修改交接提示词
  - 在 `.codex/skills/devflow/SKILL.md` 中新增上下文预算（context budget）、恢复热路径（resume hot path）与深度追溯路径（deep trace path）规则
  - 在 `references/recording-rules.md` 中补充滚动摘要（rolling summary）、总记录（overall record）与文件预算建议
  - 在 `references/workspace-and-templates.md` 中补充 `development-overview.md`、读取分层和总记录模板
  - 同步更新 `devflow-handoff.md`，让交接收尾默认只读热路径，并按需更新总记录
- 关键决策：
  - `state.md` 与 `checkpoints.md` 是默认恢复热路径
  - `development-overview.md` 是给人理解完整开发过程的总记录，不是默认恢复必读文件
  - `devflow-handoff.md` 只同步收尾流程，不能替代 `devflow` 技能本体优化
- 风险与阻塞：
  - 本轮未建设评测（Evaluation）资产
  - 子 skill 协同问题仍未修改
- 立即下一步：
  - 运行关键词搜索与 `git diff --check`
  - 如验证通过，询问用户是否需要提交代码
- 相关文件与证据：
  - `.codex/skills/devflow/SKILL.md`
  - `.codex/skills/devflow/references/recording-rules.md`
  - `.codex/skills/devflow/references/workspace-and-templates.md`
  - `devflow-handoff.md`
  - `.devflow/devflow-skill-optimization/plans/2026-05-01-context-budget-overall-record-plan.md`
