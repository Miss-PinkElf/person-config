# 经验沉淀

## 有效做法

- 先用 `brainstorming` 把路径、记录模型、checkpoint/handoff 分工说清，再写 spec，后续实现明显更稳。
- 对这类“工作流 skill 优化”任务，设计 spec 和实现 plan 分开写很有必要。
- 直接复用已有子技能能显著加快第一版落地速度，但必须做一轮路径与语义清理。
- 对复制过来的子技能，最先要查的是：
  - 旧 skill 名称残留
  - 旧工作区路径残留
  - 根目录模板和引用是否断链
- 用 `git show` 回读原始版本，再判断当前 skill 有没有偏离原意，比只看工作区 diff 更可靠。
- 对这类 workflow skill，按“OpenSpec 管阶段推进，Superpowers 管思考质量，外层只管调度与记录”来收边界，能明显降低混乱。
- 在做大段 skill 优化后，尽快切到 `skill-creator-cc` 视角评审，会更容易发现“该停下做 eval”而不是继续写文档。

## 无效做法

- 把旧 `context-budget-explore`、`spark-workflow`、`session-handoff` 的结构继续往上包一层，问题不会消失。
- 只写主入口 `SKILL.md` 不查复制子技能的引用，会留下运行时断链。
- 把 `openspec-*` 也加厚成“方法论 skill”，会抢走 `superpowers-*` 的职责。
- 外层主 skill 一直加条目和说明，最后会变成“总纲 + 细则 + 子 skill 重复一遍”的厚文档。

## 可复用策略

- 对新的总入口 skill，先做“薄主入口 + 多子技能”，再通过真实任务验证决定是否继续拆分。
- 在第一次实现收尾时，最好立刻写 `.explore` 记录和 `NEXT-SESSION-PROMPT.md`，不然后续容易断上下文。
- 当用户明确说“我要休息、写 handoff、更新 prompt、提交代码”时，优先把 `.explore` mission 与根目录 `NEXT-SESSION-PROMPT.md` 一起收口，不要只写其中一个。

## 要避免的坑

- 忽略 `openspec-propose` 对模板和映射文档的根级依赖。
- 忽略 `session-handoff` 中的旧 `.explore` 默认路径。
- 在未做真实任务验证前，过早设计迁移兼容层。
- 没经过真实 trigger / workflow eval 就继续长期重写 skill，很容易陷入“文档越来越好看，实际触发和执行仍未知”。
