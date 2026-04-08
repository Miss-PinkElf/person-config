# Next Session Prompt

请继续当前关于 `devflow` skill 优化与验证的任务，并直接基于仓库中的记录继续，不要重新从“原始需求是什么”“为什么不继续用 `context-budget-explore`”开始讨论。这些结论已经沉淀好了。

先按这个顺序读取：

1. `.explore/skill-devflow-optimization/state.md`
2. `.explore/skill-devflow-optimization/handoffs/2026-04-09-001-rest-ready.md`
3. `docs/superpowers/specs/2026-04-09-devflow-design.md`
4. `docs/superpowers/plans/2026-04-09-devflow-implementation.md`
5. `.codex/skills/devflow/SKILL.md`

当前已确认事实：

- 新 skill 名称已经定为 `devflow`，并且这轮是“先新建，不迁移旧 skill”。
- `devflow` 的定位已经定为“薄主入口 + 多子技能”。
- 新工作区规则已经定为 `.devflow/<mission-slug>/`。
- 路径规则已经收口为：
  - 轻量路径
  - 重型路径
  - bug 路径
  - resume 路径
- 路径采用“系统先判断 + 用户可覆盖”。
- 记录策略已经收口为“核心文件默认创建，阶段文件懒创建”。
- `checkpoint` 与 `handoff` 的分工已经明确：
  - checkpoint：阶段快照
  - handoff：正式交接
- `plan != spec` 已经被写成硬规则。
- 简体中文设计 spec 已完成：
  - `docs/superpowers/specs/2026-04-09-devflow-design.md`
- 实现 plan 已完成：
  - `docs/superpowers/plans/2026-04-09-devflow-implementation.md`
- 第一版 `devflow` 已创建：
  - `.codex/skills/devflow/SKILL.md`
  - `.codex/skills/devflow/references/`
  - `.codex/skills/devflow/assets/templates/`
  - `.codex/skills/devflow/skills/`
- 复制过来的 OpenSpec / Superpowers / session-handoff 子技能已经做过一轮路径和语义改写。

下轮优先目标：

1. 先做真实任务 smoke test，不要继续只停留在文档层。
2. 至少选两个场景试跑 `devflow`：
   - 一个轻量任务
   - 一个中型或重型任务
3. 重点验证：
   - 路径判断是否合理
   - `plan` / `spec` 落盘是否符合预期
   - `state` / `checkpoint` / `handoff` 链路是否自洽
4. 重点复查以下子技能在 `devflow` 语境下是否还残留旧假设：
   - `.codex/skills/devflow/skills/openspec-explore/SKILL.md`
   - `.codex/skills/devflow/skills/openspec-propose/SKILL.md`
   - `.codex/skills/devflow/skills/session-handoff/SKILL.md`
5. 如果验证中发现问题，优先修：
   - 主入口规则
   - 子技能路径引用
   - 模板断链
   不要急着做旧 skill 的迁移兼容层。

输出要求：

- 先给出简洁现状判断和下一步建议，再开始改文件。
- 不要重新重复完整需求讨论。
- 优先更新 `.explore/skill-devflow-optimization/` 下的记录。
- 如果要提交代码，只提交这轮 `devflow`、`.explore/skill-devflow-optimization/`、`docs/superpowers/plans/2026-04-09-devflow-implementation.md`、`NEXT-SESSION-PROMPT.md` 相关文件，不要误带其它无关改动。
