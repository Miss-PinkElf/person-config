# 写作技能体系（Writing Skills System）工作流

## 当前目标

围绕写文档、写文章、总结对话、提取知识点等需求，逐步沉淀一组可复用的写作类技能（writing-related skills）。

## 当前路径

- 路径：重型路径（Heavy Path）
- 当前阶段：Close / Handoff
- 当前里程碑：`conversation-to-knowledge-doc` 第一版已完成

## 已完成范围

- 吸收原始提示词（prompt）和公开技能（public agent skills）参考。
- 完成对话转知识文档技能（conversation-to-knowledge-doc skill）的对齐、计划、OpenSpec artifact 和实现。
- 同时生成真相源（source of truth）和同步副本（sync copy）。
- 完成格式验证、同步一致性验证和未完成标记检查。

## 暂不包含

- 总写作技能（writing-docs skill）
- 长聊天分段处理（long chat chunk processing）
- 全仓库自动扫描与历史文档自动纳入
- 真实场景 forward-testing

## 下一步

新对话默认先读取 `state.md` 与 `checkpoints.md`。如果要理解完整过程，再读取 `development-overview.md`、`decision-log.md`、`plans/` 和最新 handoff。
