# devflow CLI Worker VSCode Extension

本插件用于 macOS VSCode（VSCode Extension）中快速新开终端并启动 devflow CLI Worker（devflow CLI Worker）。

## 范围

- 支持 macOS VSCode 内置终端（VSCode Integrated Terminal）。
- 不支持 Windows 原生、PowerShell（pwsh）或 WSL（Windows Subsystem for Linux）。
- 不提供 worker 管理 UI（User Interface）。

## 使用

1. 在 VSCode 中打开仓库根目录。
2. 插件会自动新开 `devflow worker: macos-worker` 终端，启动或复用默认 worker，并 attach 到对应 tmux（tmux）会话：

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs ensure-in-vscode --id macos-worker --command codex && tmux attach -t devflow-worker-macos-worker
```

已有 `devflow-worker-macos-worker` tmux（tmux）会话时，插件只 attach，不启动第二个 Codex CLI（Codex CLI）worker。

需要额外 worker 时，运行命令 `Start devflow CLI Worker` 并输入其它 worker id。该手动入口会创建新 session：

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs start-in-vscode --id <worker-id> --command codex && tmux attach -t devflow-worker-<worker-id>
```

当 worker 已由 CLI 启动时，运行以下命令请求插件在 VSCode 中打开或聚焦对应终端：

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs open-in-vscode --id <worker-id>
```

该桥接只负责终端展示和 attach；worker 的消息、Bash 命令、`/clear` 和轮询仍由 CLI（CLI）直接控制 tmux（tmux）。

## 安装包

本地打包产物：

```text
vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.1.vsix
```
