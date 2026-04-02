# 当前状态

## 当前阶段
- Checkpoint / Handoff

## 已确认的事实
- `context-budget-explore` 的核心单位是 `.explore/<mission>/`，它解决的是单个 mission 的长期探索、状态、checkpoint 和 handoff。
- 现有 skill 结构已经形成“外层 mission/workflow 管理 + 内层 `spark-workflow` 执行 + `session-handoff` 暂停恢复”两层半模型。
- 当一个项目里会反复出现多个需求、多个 mission、跨任务复用经验和检索历史时，现有 skill 缺少项目级 registry / routing / retrieval 能力。
- 外部参考项目普遍把项目层、变更层、记忆层、执行层拆开，而不是继续把职责压进单个 workflow skill。

## 工作假设
- 最合理的方向是新增一个比 `context-budget-explore` 更外层的项目级 skill，而不是继续让 `context-budget-explore` 膨胀。
- 新 skill 可以先作为 orchestrator / registry 层存在，内部再调用 `context-budget-explore` 处理具体 mission。

## 待解决的问题
- 新 skill 的最终命名是否定为 `project-context-orchestrator`，还是采用更偏 registry/memory 的命名。
- 项目级目录结构是否放在 `.explore/projects/<project-slug>/`，以及与现有 mission 目录如何关联。
- 第一版是否只做文档协议，还是直接补 `SKILL.md` 和模板。

## 下一步
- 先定新 skill 的名字、触发描述和职责边界。
- 设计项目级目录和最小真相源文件。
- 再决定是直接新建 skill，还是先写设计文档。

## 最新 handoff
- `handoffs/2026-04-02-001-resume-ready.md`

## 最小活跃上下文摘要
- 当前共识：`context-budget-explore` 是 mission 层，不是 project 层。
- 当前建议：新增项目级 skill，负责多 mission 管理、registry、timeline、retrieval 和路由。
- 当前没有实现代码，主要产物是分析结论、handoff 和下一轮提示词。
