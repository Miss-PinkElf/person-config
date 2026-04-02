# 任务工作流

## 任务目标
- 为 `context-budget-explore` 之上是否需要再加一层项目级 skill 形成明确结论。
- 如果需要，沉淀新 skill 的职责边界、触发条件、目录结构和与现有 skill 的调用关系。

## 范围边界
- 范围内：
  - 分析 `context-budget-explore` 当前层级和适用边界。
  - 对比外部参考项目，判断项目级 orchestration / memory / spec 层的常见拆分方式。
  - 给出新 skill 的推荐职责和下一步实现方向。
- 范围外：
  - 本轮不正式编写新 skill 的完整 `SKILL.md`。
  - 本轮不实现索引器、RAG、browser driver 或自动化脚本。

## 成功标准
- 说明 `context-budget-explore` 适合单 mission，而不是项目级多 mission 管理。
- 明确是否需要新增项目级 skill。
- 给出至少一版新 skill 的推荐定位和后续动作。

## 阶段规划
1. 读取现有 `context-budget-explore` 及相关内置子 skill。
2. 对照外部参考项目，判断是否需要新增项目层。
3. 沉淀当前结论、handoff 和下次继续提示词。

## 当前阶段
- Route 1 探索完成，进入 checkpoint / handoff 收尾。

## 退出条件
- 当前探索结论已写入文档。
- handoff 已生成。
- 已提供可直接复制的下一轮提示词。
