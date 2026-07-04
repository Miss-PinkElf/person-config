---
title: devflow-cli-worker 核心思路与需求
created_at: 2026-07-03
updated_at: 2026-07-03
author: Claude
status: Active
purpose: 梳理 devflow-cli-worker 的核心痛点、需求和设计方案
related_mission: devflow-cli-worker
scope: 需求分析与架构设计说明文档
---

# devflow-cli-worker 核心思路与需求

## 一、核心痛点

使用 Claude Code / Codex CLI 调用 subagent 时，subagent 都是**黑盒**的 —— 跑在后台，用户看不到它在干什么，也无法中途介入、打断或纠正方向。

用户想要的效果类似于 Claude Code 的 Agent Team：主 agent 在操作，但**每个 subagent 的终端窗口对用户可见**，用户可以随时介入。

## 二、核心需求

### 需求 1：让 subagent 可见、可介入

主 agent 可以像人一样操作终端 —— 输入提示词、输入 slash 命令、新开对话、清空上下文。用户也可以随时介入接管。

理想状态：subagent 就像一个真人在终端输入 `codex` / `claude` 然后进行各种操作，只不过这个"人"变成了 agent。

### 需求 2：用 skill + CLI 替代黑盒 subagent

写一个 skill，作用就是启动**独立的 CLI 会话**代替 subagent。主 agent 想知道 subagent 做了什么，可以通过以下方式实现：
- 写一个 JSON 文件做状态同步
- 共同维护某一个 devflow mission

### 需求 3：CLI 的基础操作能力

CLI 的作用是：开终端、输入命令、输入提示词。

为了节省上下文，文档方面可以采取**滑动窗口**的方式 —— 有最新的文档，也有归档的文档。

### 需求 4：核心操作闭环 —— "观察 → 判断 → 操作 → 反馈"

CLI 的操作不需要太多分类，核心只有几种操作：
1. **知道被控制终端发生了什么** → `get-info`（捕获屏幕）
2. **把情况反馈给主 agent** → 结构化输出
3. **主 agent 做判断** → 由主 agent 自行决策
4. **发送命令给被控制终端** → `send` / `paste` / `key`
5. **终端执行操作后反馈结果** → 回到第 1 步

像人一样盯着这个终端，知道发生了什么，然后知道应该如何做。

### 需求 5：等待与轮询优化

编码等待时间最长 20 分钟（`--timeout 1200`），同时需要轮询状态：
- 比如每 15 秒检查一次（`--poll 15`），如果有授权弹窗或异常可以提前知道
- 也可以提前知道 subagent 完成了工作（`--stale 30`，屏幕 30 秒无变化视为可能完成）
- 避免主 agent 一直等一直等的僵死状态

同时 `result.md` 的路径需要在组装 prompt 时明确标注，使用相对路径确保 worker 能找到。

### 需求 6：用户原始提示词 + 多 worker 并行

最好保留用户的**原始提示词**，一字不改。组装 prompt 时使用相对路径把 result 标注清楚。

同时考虑插件是否可以并行 —— 多开好几个 worker 同时工作。

## 三、核心方案

### 整体架构

**用 tmux 会话替代黑盒 subagent**：不再让主 agent 通过 SDK/API 调用 subagent，而是让主 agent 像真人一样，在一个独立的、可见的 tmux 终端里启动和操控另一个 CLI（codex/claude/shell）实例。

```
┌──────────────────────────────────────────────┐
│  主 Agent (Claude Code 对话)                  │
│                                              │
│  1. 组装 prompt（含约束 + 任务 + result 路径） │
│  2. 调用 devflow-worker CLI 启动 worker       │
│  3. 通过 get-info 观察 worker 屏幕            │
│  4. 通过 send / key / interrupt 操控 worker   │
│  5. 读取 result.md 获取 worker 产出           │
└──────────────┬───────────────────────────────┘
               │ CLI 调用
               ▼
┌──────────────────────────────────────────────┐
│  devflow-worker CLI (Bash 脚本)               │
│                                              │
│  - 创建 tmux session，在里面启动 codex/claude │
│  - 占位符替换 ({{WORKER_ID}}, {{RESULT_PATH}})│
│  - 提供 17+ 子命令操控终端                    │
│  - 写入 session 附件 (cli-session.json 等)    │
└──────────────┬───────────────────────────────┘
               │ tmux 控制
               ▼
┌──────────────────────────────────────────────┐
│  tmux Session (每个 worker 一个)              │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  codex / claude CLI 实例               │  │
│  │  (可见终端，用户可随时 attach 介入)     │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  显示层：iTerm2 / Terminal.app / VSCode 终端  │
└──────────────────────────────────────────────┘
```

### 关键设计

1. **主 agent 是"监工"而非 SDK 调用者**：通过 `get-info` 捕获屏幕文本 → 观察状态 → 通过 `send` 下指令，完全模仿真人在终端里的操作方式。

2. **diff-based 等待机制（wait-agent）**：不依赖任何 agent TUI 文案，纯字符串对比。屏幕持续变化 = 工作中；屏幕无变化超 30s = `stale`，主 agent 自行判断下一步。

3. **快速审批循环**：`capture` + 5s sleep 快速轮询，发现权限弹窗连续批，不用等 `wait-agent` 的 stale 周期。

4. **可见性三层**：外部终端（默认 iTerm2/Terminal.app）、VSCode 内置终端、无界面（`--no-visual`）。

5. **prompt 组装职责上移**：CLI 只做占位符替换，主 agent 负责读取模板 + 用户原始提示词组装完整 prompt。用户原始提示词一字不改。

6. **session 附件不替代 devflow 主文档**：`cli-session.json`、`result.md`、`transcript.log` 是单次运行凭证，长期状态以 devflow 的 `state.md`、`checkpoints.md` 为准。

7. **多 worker 并行方案 A**：不用 `wait-agent` 长期阻塞，用 `get-info --tail 5` 轻量轮询所有 worker。

## 四、命令速查

| 命令 | 用途 |
|------|------|
| `start` | 创建 worker + tmux session + 自动开启外部终端 |
| `start-in-ide` | 创建 worker 并在 IDE 终端显示 |
| `send <id> <msg>` | 发送消息并自动回车提交 |
| `paste <id> <text>` | 粘贴文本不提交 |
| `get-info <id> --tail N` | 查看 worker 状态 + 最近 N 行屏幕 |
| `capture <id>` | 捕获当前完整屏幕 |
| `wait-agent <id>` | diff-based 阻塞等待（默认 1200s / 15s poll / 30s stale） |
| `clear <id>` | 发送 /clear 清空上下文 |
| `interrupt <id>` | 发送 Ctrl+C |
| `key <id> <key>` | 发送单个按键（Enter/Escape/C-c 等） |
| `kill <id>` | 终止 tmux session（不删文件） |
| `close <id>` | 标记记录为已关闭（不杀进程） |
| `status <id>` | 查看 worker 元数据 |
| `transcript <id>` | 查看完整操作日志 |