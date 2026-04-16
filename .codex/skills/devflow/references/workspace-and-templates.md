# 工作区与模板说明

## 工作区结构

```text
.devflow/<mission-slug>/
├── workflow.md
├── state.md
├── decision-log.md
├── plans/
├── spec/
├── bug-log.md
├── learnings.md
├── checkpoints.md
├── checkpoints-archive.md
├── session-tasks.md
└── handoffs/
```

推荐命名：

- `plans/YYYY-MM-DD-<topic>-plan.md`
- `plans/YYYY-MM-DD-<topic>-light-tasks.md`
- `handoffs/YYYY-MM-DD-<seq>-<slug>.md`

## 默认创建与懒创建

### 默认创建

mission 初始化时立即创建：

- `workflow.md`
- `state.md`
- `decision-log.md`

初始化时建议立即填入：

- 当前目标
- 范围
- 成功标准
- 当前路径
- 当前阶段
- 下一步

### 按阶段懒创建

进入相应阶段时再创建：

- `plans/`
- `spec/`
- `bug-log.md`
- `learnings.md`
- `checkpoints.md`
- `checkpoints-archive.md`
- `session-tasks.md`
- `handoffs/`

这样既保留长期任务骨架，也避免小任务一开始铺满空文件。

## 模板使用时机

- `workflow-template.md`
  - mission 初始化；路径、阶段或里程碑变化时同步更新
- `state-template.md`
  - mission 初始化，后续持续更新
- `decision-log-template.md`
  - 出现关键取舍后
- `plan-template.md`
  - Align 完成后
- `light-tasks-template.md`
  - 轻量路径进入 Apply 前
- `bug-log-template.md`
  - bug 路径进入调试后
- `checkpoint-template.md`
  - 阶段切换、里程碑、暂停前、Close 前
- `handoff-template.md`
  - 暂停、跨对话、上下文过长、阶段性交接

## Checkpoint 规则

`checkpoints.md` 只保留最近 3 条 checkpoint。

新 checkpoint 写入后，如果超过 3 条：

- 把较旧条目搬到 `checkpoints-archive.md`
- `checkpoints-archive.md` 不主动读取
- 只有追历史时才打开

建议流程：

1. 先把新 checkpoint 追加到 `checkpoints.md`
2. 如果条目数超过 3，搬走最旧条目
3. 在 `state.md` 中记录最新 checkpoint 的主题或时间

## Resume 读取建议

恢复当前 mission 时，建议按以下顺序读取：

1. `state.md`
2. `checkpoints.md`
3. 最新 `handoff`
4. `workflow.md`
5. `spec/` 或 `plans/`

## Spec 规则

重型路径固定使用：

- `proposal.md`
- `design.md`
- `tasks.md`

轻量路径不强制三件套，优先使用轻量 `plan + tasks`。
