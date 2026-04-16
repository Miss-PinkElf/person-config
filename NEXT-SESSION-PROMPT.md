# Next Session Prompt

请继续当前关于 `devflow` skill 优化与验证的任务，并直接基于仓库中的最新记录继续，不要重新从“为什么要做 devflow”“OpenSpec / Superpowers / DevFlow 各自负责什么”开始讨论。这些边界已经收口完成。

先按这个顺序读取：

1. `.explore/skill-devflow-optimization/state.md`
2. `.explore/skill-devflow-optimization/checkpoints.md`
3. `.explore/skill-devflow-optimization/handoffs/2026-04-16-002-rest-ready.md`
4. `.codex/skills/devflow/SKILL.md`
5. `.codex/skills/devflow/skills/openspec-explore/SKILL.md`
6. `.codex/skills/devflow/skills/openspec-propose/SKILL.md`
7. `.codex/skills/devflow/skills/openspec-apply-change/SKILL.md`
8. `.codex/skills/devflow/skills/openspec-archive-change/SKILL.md`
9. `.codex/skills/devflow/skills/session-handoff/SKILL.md`

当前已确认事实：

- `devflow` 的总体定位已经明确：
  - OpenSpec 管阶段推进
  - Superpowers 管思考质量
  - DevFlow 管主线记录、路径调度与恢复
- `devflow` 工作区规则已经确定为 `.devflow/<mission-slug>/`。
- 路径规则已经收口为：
  - 轻量路径
  - 重型路径
  - bug 路径
  - resume 路径
- `plan != spec` 是硬规则。
- `checkpoint` 与 `handoff` 的分工已经收口：
  - checkpoint：阶段内沉淀与近期恢复
  - handoff：正式交接补充入口
- `superpowers-*` 子技能已补到接近原版强度，并补齐相关 prompt / reference 文件。
- `openspec-*` 子技能已经完成一轮边界收口：
  - 更强调生命周期控制
  - 不再承担 `superpowers-*` 的质量方法论职责
- `devflow` 外层已经做了一轮收敛，不再继续朝“超厚主 skill”方向扩写。
- `devflow` 内置 `session-handoff` 已调整为 checkpoint-first 恢复顺序。

当前未完成 / 还没验证的部分：

- 还没有做真实任务 smoke test。
- 还没有按 `skill-creator-cc` 的思路做最小 eval。
- `devflow` 与 `context-budget-explore` / `spark-workflow` 的触发边界还没有通过真实 prompt 验证。
- 旧 `context-budget-explore` 的迁移策略还没开始设计。
- `context-budget-explore` 自己的内置 `session-handoff` 仍是旧的 handoff-first 恢复逻辑，这一项这轮没有动。

下轮优先目标：

1. 停止继续大幅改写 `devflow` 文档，转入验证模式。
2. 先用 `skill-creator-cc` 的视角设计一组最小高价值 eval prompt，至少覆盖：
   - 应该触发 `devflow`
   - 不应该触发 `devflow`
   - `devflow` 与 `context-budget-explore` / `spark-workflow` 的冲突场景
3. 用三个真实场景各走一遍 `devflow`：
   - 一个轻量任务
   - 一个重型任务
   - 一个 resume 场景
4. 验证重点：
   - 路径判断是否合理
   - 是否真的走 `Align -> Plan -> Propose / Apply`
   - `state / checkpoint / handoff` 链路是否自洽
5. 只有在验证暴露真实问题后，再决定是否继续修改 skill 文档或开始设计迁移策略。

执行要求：

- 先给出现状判断和验证计划，不要直接继续扩写 skill。
- 优先更新 `.explore/skill-devflow-optimization/` 记录。
- 如果要再提交代码，只提交这一轮验证相关文件，不要误带 `.claude/worktrees/` 之类无关改动。
