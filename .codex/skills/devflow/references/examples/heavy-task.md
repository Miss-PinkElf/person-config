# 重型路径示例

场景：为现有系统增加一套新的多阶段工作流，并且需要跨多轮对话推进。

## 路径判断

判断为重型路径，因为：

- 需求存在多阶段推进
- 需要正式产物管理
- 会影响多个模块与后续实施节奏

## 执行方式

1. 完整 Align
2. 写 `plans/`
3. 进入 `proposal.md`、`design.md`、`tasks.md`
4. 按 `tasks.md` 实施
5. 做 review 与 verify
6. 更新 `state.md`、必要时写 checkpoint

## 关键约束

- `plan` 先于 spec
- `proposal/design/tasks` 获批后再进入大规模实施
- 实施中若发现设计错误，回退到 Propose
