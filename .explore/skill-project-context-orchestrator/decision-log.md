# 决策日志

## 历史决策摘要

（当完整记录超过 5 条时，旧决策压缩到这里）

## 完整记录

### [#1] 2026-04-02

- 决策：不继续把职责堆进 `context-budget-explore`，改为在其外层新增项目级 skill。
- 备选方案：
  - 继续扩展 `context-budget-explore`
  - 给 `context-budget-explore` 增加一个轻量 registry 子层
- 原因：
  - 当前 skill 的真相源和生命周期都是按单 mission 组织的。
  - 多需求项目需要的是跨 mission 的 registry / routing / retrieval，而不是单 mission 状态文件继续膨胀。

### [#2] 2026-04-02

- 决策：先把下一层定义为“项目级 orchestrator / registry 层”，由它调用 `context-budget-explore`。
- 备选方案：
  - 直接创建 memory / RAG skill
  - 直接创建 browser / computer-use skill
- 原因：
  - 当前首要缺口是项目级编排和真相源，不是执行器能力。
  - memory / RAG 更适合作为项目级 skill 内部能力或后续子 skill。
