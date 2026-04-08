# 经验沉淀

## 有效做法

- 先用 `brainstorming` 把路径、记录模型、checkpoint/handoff 分工说清，再写 spec，后续实现明显更稳。
- 对这类“工作流 skill 优化”任务，设计 spec 和实现 plan 分开写很有必要。
- 直接复用已有子技能能显著加快第一版落地速度，但必须做一轮路径与语义清理。
- 对复制过来的子技能，最先要查的是：
  - 旧 skill 名称残留
  - 旧工作区路径残留
  - 根目录模板和引用是否断链

## 无效做法

- 把旧 `context-budget-explore`、`spark-workflow`、`session-handoff` 的结构继续往上包一层，问题不会消失。
- 只写主入口 `SKILL.md` 不查复制子技能的引用，会留下运行时断链。

## 可复用策略

- 对新的总入口 skill，先做“薄主入口 + 多子技能”，再通过真实任务验证决定是否继续拆分。
- 在第一次实现收尾时，最好立刻写 `.explore` 记录和 `NEXT-SESSION-PROMPT.md`，不然后续容易断上下文。

## 要避免的坑

- 忽略 `openspec-propose` 对模板和映射文档的根级依赖。
- 忽略 `session-handoff` 中的旧 `.explore` 默认路径。
- 在未做真实任务验证前，过早设计迁移兼容层。
