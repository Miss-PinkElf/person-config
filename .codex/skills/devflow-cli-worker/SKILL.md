---
name: devflow-cli-worker
description: |
  当需要把黑盒 subagent 改成可见、可介入的独立 CLI worker 时使用本技能。适用于用户要求“不要黑盒 subagent”、“开一个可见 worker”、“让主 Agent 操作终端里的 codex/claude”、“多 worker 并行”、“轮询 worker 状态”、“把结果写到 result.md”或在 devflow mission 中分派可观察子任务。本技能指导主 Agent 使用 devflow Worker CLI（devflow Worker CLI）启动、观察、控制、轮询并收回 worker 结果。
---

# devflow CLI Worker

## 适用范围

使用 devflow Worker CLI（devflow Worker CLI）把子任务放进可见、可介入的 macOS tmux（tmux）会话中运行。

本技能默认只覆盖 macOS。Windows 原生、PowerShell（pwsh）、WSL（Windows Subsystem for Linux）和 Windows / WSL VSCode 入口不在本轮范围内。

## 核心原则

- 保留用户原始提示词（Original Prompt），不要改写。
- 每个 worker 必须有独立 worker id。
- 每个 worker 必须写入自己的 result.md（Result File）。
- 主 Agent 必须轮询观察，不要长时间盲等。
- worker 的长期结论必须回写到当前 devflow mission，不把 session 附件当成唯一真相源。

## 启动流程

1. 选择 worker id，例如 `research-a`。
2. 读取 `references/prompt-template.md`。
3. 组装 prompt，明确写入 result.md 相对路径。
4. 运行：

```bash
node tools/devflow-cli-worker/bin/devflow-worker.mjs start --id research-a --command codex --prompt "<assembled prompt>"
```

## 观察与控制

优先使用轻量轮询：

```bash
node tools/devflow-cli-worker/bin/devflow-worker.mjs get-info research-a --tail 5
```

需要发送下一步指令：

```bash
node tools/devflow-cli-worker/bin/devflow-worker.mjs send research-a "继续执行下一步，并把结论写入 result.md"
```

需要等待但不能盲等：

```bash
node tools/devflow-cli-worker/bin/devflow-worker.mjs wait-agent research-a --timeout 1200 --poll 15 --stale 30
```

## 多 worker 并行

多 worker 并行（Parallel Workers）时，不要同时长阻塞多个 `wait-agent`。

推荐循环读取：

```bash
node tools/devflow-cli-worker/bin/devflow-worker.mjs get-info worker-a --tail 5
node tools/devflow-cli-worker/bin/devflow-worker.mjs get-info worker-b --tail 5
```

## 收回结果

读取对应 session 的 result.md，并将有效结论整合回当前任务。

结果路径格式：

```text
.devflow/devflow-cli-worker/sessions/<worker-id>/result.md
```
