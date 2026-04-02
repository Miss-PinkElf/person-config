# Checkpoints

## 2026-04-02 / checkpoint-001

- 当前阶段：探索收尾
- 本轮完成内容：
  - 读取并分析了 `context-budget-explore` 的定位、边界和目录模型。
  - 对照外部项目，确认需要项目级一层来管理多 mission / 多需求场景。
  - 给出了新 skill 的推荐定位和职责草案。
- 本轮决策与原因：
  - 决定新增项目级 skill，而不是继续扩展 `context-budget-explore`。
  - 原因是现有 skill 的抽象单位是 mission，不覆盖项目级 registry / routing / retrieval。
- 本轮沉淀经验：
  - 把“长任务 skill”和“项目级 orchestration skill”拆开，后续更容易维护。
- 待解决问题：
  - 新 skill 命名、目录结构、第一版范围。
- 下一步：
  - 起草新 skill 的 `SKILL.md` 结构和项目级模板。
- 可以从活跃上下文移除的内容：
  - 外部项目的检索过程细节。
  - 多轮来回讨论的原始措辞。
