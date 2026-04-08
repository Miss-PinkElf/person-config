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

## 默认创建与懒创建

### 默认创建

mission 初始化时立即创建：

- `workflow.md`
- `state.md`
- `decision-log.md`

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
  - mission 初始化
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
  - 阶段切换、里程碑、暂停前
- `handoff-template.md`
  - 暂停、跨对话、上下文过长、阶段性交接

## Checkpoint 规则

`checkpoints.md` 只保留最近 3 条 checkpoint。

新 checkpoint 写入后，如果超过 3 条：

- 把较旧条目搬到 `checkpoints-archive.md`
- `checkpoints-archive.md` 不主动读取
- 只有追历史时才打开

## Spec 规则

重型路径固定使用：

- `proposal.md`
- `design.md`
- `tasks.md`

轻量路径不强制三件套，优先使用轻量 `plan + tasks`。
