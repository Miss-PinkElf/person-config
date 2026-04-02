# Next Session Prompt

请继续当前关于“是否在 `context-budget-explore` 之上新增项目级 skill”的探索，并直接基于仓库里的记录继续，不要从头重复分析。

先按这个顺序读取：

1. `.explore/skill-project-context-orchestrator/handoffs/index.md`
2. `.explore/skill-project-context-orchestrator/handoffs/2026-04-02-001-resume-ready.md`
3. `.explore/skill-project-context-orchestrator/state.md`
4. `zzz-docs/接下来想写or优化的skills-思路.md`
5. `.codex/skills/context-budget-explore/SKILL.md`

当前共识：

- `context-budget-explore` 是 mission 层 skill，适合单个长任务，不适合直接承担项目级多 mission 管理。
- 如果一个项目里会反复出现多个需求、多个 mission、跨任务复用经验和恢复历史，应该新增一个更外层的 project 层 skill。
- 这个新 skill 应该负责 project registry、timeline、mission map、retrieval 和路由；进入具体需求时再调用 `context-budget-explore`。

本轮优先目标：

1. 先给这个新 skill 定一个稳定的名字。
2. 起草它的 `description`、职责边界和触发条件。
3. 设计项目级目录结构，以及它与 `.explore/<mission>/` 的关系。
4. 判断第一版是先写设计文档，还是直接新建 skill。

输出要求：

- 先给出清晰方案，不要一上来就写大而全实现。
- 如果要落盘，优先更新 `.explore/skill-project-context-orchestrator/` 下的记录。
- 如果结论稳定，再开始新建 skill 文件。
