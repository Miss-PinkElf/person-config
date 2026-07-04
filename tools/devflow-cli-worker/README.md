# devflow CLI Worker

devflow CLI Worker（devflow CLI Worker）用于在 macOS 上启动可见、可介入的 worker 会话。

## 依赖

- macOS
- Node.js
- tmux（tmux）
- Terminal.app 或 iTerm2

## 常用命令

```bash
node tools/devflow-cli-worker/bin/devflow-worker.mjs start --id research-a --command codex --prompt "把结果写到 result.md"
node tools/devflow-cli-worker/bin/devflow-worker.mjs get-info research-a --tail 5
node tools/devflow-cli-worker/bin/devflow-worker.mjs wait-agent research-a --timeout 1200 --poll 15 --stale 30
node tools/devflow-cli-worker/bin/devflow-worker.mjs send research-a "继续，并更新 result.md"
node tools/devflow-cli-worker/bin/devflow-worker.mjs kill research-a
```

macOS VSCode 插件入口（VSCode Extension Entry）会在内置终端中执行：

```bash
node tools/devflow-cli-worker/bin/devflow-worker.mjs start-in-vscode --id <worker-id> --command codex && tmux attach -t devflow-worker-<worker-id>
```

## Session 文件

```text
.devflow/devflow-cli-worker/sessions/<worker-id>/
├── cli-session.json
├── result.md
├── transcript.log
├── screen.txt
└── prompt.md
```

## 当前限制

- Windows 原生、PowerShell（pwsh）、WSL（Windows Subsystem for Linux）不在本轮范围内。
- macOS 真实终端冒烟验证需要在 Mac 上执行。
