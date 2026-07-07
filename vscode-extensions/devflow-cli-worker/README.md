# devflow CLI Worker VSCode Extension

本插件用于 macOS VSCode（VSCode Extension）中快速新开终端并启动 devflow CLI Worker（devflow CLI Worker）。

## 范围

- 支持 macOS VSCode 内置终端（VSCode Integrated Terminal）。
- 不支持 Windows 原生、PowerShell（pwsh）或 WSL（Windows Subsystem for Linux）。
- 不提供 worker 管理 UI（User Interface）。

## 使用

1. 在 VSCode 中打开仓库根目录。
2. 运行命令：`Start devflow CLI Worker`。
3. 输入 worker id。
4. 插件会新开终端，启动 worker，并 attach 到对应 tmux（tmux）会话：

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs start-in-vscode --id <worker-id> --command codex && tmux attach -t devflow-worker-<worker-id>
```

## 安装包

本地打包产物：

```text
vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.0.vsix
```
