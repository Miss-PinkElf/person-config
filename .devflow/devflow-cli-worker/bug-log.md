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

该结论已在 2026-07-10 被更新：tmux Driver（tmux Driver）改用 `send-keys -l` 字面量模式输入文本，并在短暂等待后发送 Enter。`send` 负责普通提示词，`clear` 负责 `/clear` 并验证 Context 100%，不再要求 Skill（Skill）执行额外 Enter。

## 2026-07-10：slash 命令与 tmux 文本注入不稳定

### 问题现象

`paste /clear` 与独立 `key Enter` 在真实 Codex CLI（Codex CLI）会话中缺乏原子性和可追溯确认：命令会记录为已粘贴，但 Context 不一定清空；普通文本注入也可能停留在输入框。

### 问题原因

旧 tmux Driver（tmux Driver）未使用 `send-keys -l`，slash 文本可能受到键名解析或输入缓冲影响；将文本和 Enter 分成多个 CLI 调用又会放大时序与操作错误。

### 解决方案

文本改为字面量发送，Driver 在同一 CLI 操作内短暂等待后提交 Enter。新增 `clear`，在 tmux 屏幕出现 `Context 100% left` 前不报告成功；新增 `command` 处理直接执行的 slash 命令，菜单型命令保留人工显式选择。

## 2026-07-10：历史 tmux 会话复用时缺失会话元数据

### 问题现象

执行 `ensure-in-vscode --id macos-worker --command codex` 返回 `worker macos-worker reused`，但紧接着运行 `get-info macos-worker` 报错：对应 `.devflow/devflow-cli-worker/sessions/macos-worker/cli-session.json` 不存在。此时无法发送任务、执行 `clear` 或读取结果。

### 问题原因

`ensure-in-vscode` 只通过 tmux（tmux）`has-session` 判断是否复用，未验证 CLI Session Store（CLI 会话存储）中的元数据。历史 tmux 会话保留，但其未跟踪的 session 附件目录已经不存在，形成孤立会话（Orphaned Session）。

### 解决方案

本轮已采用“拒绝并由用户确认后手工清理”的语义：结束 5 个已确认的历史测试会话，保留 `clear-task-test-20260710`；Session Store（会话存储）读取时验证 worker id、tmux session 名称、相对 session 路径与 result 路径，并忽略 JSON 中的额外覆盖字段。`ensure-in-vscode` 与 `open-in-vscode` 在设置鼠标或请求 VSCode attach 前读取元数据；缺失时给出精确的 `tmux kill-session` 命令，错配时拒绝操作并提示检查或清理。自动化测试、真实缺失元数据负向验证、默认 worker 的创建、复用和 VSCode attach 均已通过。
