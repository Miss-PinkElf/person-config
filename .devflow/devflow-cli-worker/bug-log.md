# devflow-cli-worker 问题清单

## 2026-07-04：macOS VSCode 插件启动后未自动 attach 到 tmux 会话

### 问题现象

初版 macOS VSCode 插件（VSCode Extension）命令只执行：

```bash
node tools/devflow-cli-worker/bin/devflow-worker.mjs start-in-vscode --id <worker-id> --command codex
```

这会创建 tmux 会话（tmux Session），但 VSCode 内置终端（VSCode Integrated Terminal）不会自动进入该会话，用户无法直接看到 worker 的 TUI（Terminal UI）。

### 问题原因

`start-in-vscode` 的设计是“不打开外部终端”，用于避免 CLI 在 VSCode 入口里再启动 Terminal.app / iTerm2。但插件端没有补上 `tmux attach`，导致 VSCode 终端只完成启动命令，没有进入可见 worker 会话。

### 解决方案

将 `vscode-extensions/devflow-cli-worker/src/commandBuilder.ts` 的命令改为：

```bash
node tools/devflow-cli-worker/bin/devflow-worker.mjs start-in-vscode --id <worker-id> --command codex && tmux attach -t devflow-worker-<worker-id>
```

并更新测试、README、Align 和 Design 文档，确保 macOS VSCode 插件入口语义明确为“启动 worker 后 attach 到 tmux 会话”。
