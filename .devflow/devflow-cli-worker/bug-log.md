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

## 2026-07-07：CLI 缺少显式 help 成功路径

### 问题现象

目录归并后执行轻量自检命令：

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs --help
```

CLI（Command Line Interface）返回非零退出码，并输出“未知命令。可用命令：...”。这说明 CLI 可执行，但没有明确的 help（Help）成功路径，不适合作为冒烟验证命令。

### 问题原因

`runCli` 只处理 `start`、`start-in-vscode`、`send`、`get-info` 等业务命令。未知命令分支会抛出错误并附带可用命令列表，但没有为 `--help`、`-h` 或 `help` 提供正常输出路径。

### 解决方案

在 `.codex/skills/devflow-cli-worker/cli/src/cli.mjs` 中新增共享的 usage 文本，并让 `--help`、`-h`、`help` 直接输出可用命令且成功返回；同时在 `.codex/skills/devflow-cli-worker/cli/src/cli.test.mjs` 中补充断言，确保 help 输出包含 `start` 和 `start-in-vscode`。

## 2026-07-07：Codex TUI 中 send 输入后需要额外 Enter 才稳定提交

### 问题现象

真实 macOS 冒烟验证中，执行：

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs send codex-smoke "reply exactly codex worker smoke ok"
```

文本能进入 Codex CLI TUI（Codex CLI Terminal UI）的输入行，但没有立即触发模型处理。随后执行：

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs key codex-smoke Enter
```

Codex CLI 才开始处理并回复 `codex worker smoke ok`。

### 问题原因

CLI（Command Line Interface）的 `send` 当前基于 `tmux send-keys <text> Enter`。对普通 shell 可直接提交，但 Codex TUI 对通过 tmux（tmux）注入的输入与提交键处理更接近多行输入场景，文本已输入不等于已提交。

### 解决方案

当前不改变 `send` 的默认行为，避免影响普通 shell、bash smoke 和其它 TUI（Terminal UI）。在 `.codex/skills/devflow-cli-worker/SKILL.md` 中补充 Codex CLI TUI 使用规则：如果 `send` 后文本只出现在输入行但未提交，继续执行 `key <worker-id> Enter`。本轮 `/clear` 与新对话写入 result.md 均按该方式验证通过。
