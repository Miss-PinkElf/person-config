# devflow-cli-worker 交接记录 003

## 当前目标

完成 macOS devflow CLI Worker（devflow CLI Worker）第二阶段收口：CLI 可请求 VSCode 插件（VSCode Extension）创建指定 worker 的可见 attach 终端，并稳定控制 Codex CLI（Codex CLI）文本输入与新对话。

## 当前阶段

Close（收口）：代码、文档、自动化验证和真实 macOS 冒烟验证均已完成；本轮相关文件待提交。

## 本轮完成

- 新增 VSCode attach 桥接（VSCode Attach Bridge）：`open-in-vscode --id <worker-id>` 通过 Unix Socket（Unix 域套接字）请求插件创建或聚焦 `devflow worker: <worker-id>`。
- 新增 `start-and-open-in-vscode`，一次完成 tmux worker 启动与 VSCode 新终端 attach。
- 插件支持工作区启动默认 `macos-worker`、worker 终端复用和桥接 socket 生命周期。
- tmux 默认启用 `mouse on`；所有 attach 前再次启用。
- CLI 语义分层：`send` 发送普通提示词，`command` 发送直接执行的 slash 命令，`clear` 原子发送 `/clear` 并验证 Context 100%，菜单型 slash 命令使用 `paste` 后人工选择。
- 修复 tmux 文本注入：使用 `send-keys -l` 字面量模式，短暂等待后发送 Enter，避免 `/clear` 与特殊文本被错误解析。
- 发布产物：`vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.7.vsix`。

## 真实验证证据

- `start-and-open-in-vscode --id speed-terminal-test --command codex` 创建 VSCode 终端，重复 open 返回 reused。
- `tmux show-options -t devflow-worker-speed-terminal-test -v mouse` 输出 `on`。
- `atomic-clear-test` 与 `speed-terminal-test` 的 Codex worker 完成任务写入；底层字面量 `/clear` + Enter 后，屏幕显示 `Context 100% left`，后续任务成功追加 result.md。
- 新鲜自动化验证：CLI 测试、VSCode 插件编译、插件测试、VSIX 打包、`git diff --check` 均通过；打包仍只有既有 repository 与 LICENSE 警告。

## 关键决策

- CLI 直接管理 tmux（tmux），VSCode 插件只承担可见 attach 与终端复用；不代理提示词、Bash 命令或轮询。
- 不再使用 `send + key Enter` 或 `paste + key Enter` 作为普通 Codex 提交规程；`send` 与 `clear` 都封装单次完整操作。
- 菜单型 slash 命令不自动发送确认键，避免误选。

## 未完成与延期

- 菜单型 slash 命令的自动菜单识别与选择。
- `--prompt-file`，用于复杂原始提示词。
- worker 管理 UI（User Interface）、result.md 快捷打开、状态列表与轮询提醒。
- VSIX 分发元数据：repository 和 LICENSE。
- Windows 原生、PowerShell（pwsh）、WSL（Windows Subsystem for Linux）入口。

## 提交范围

只提交本 mission 相关的 Skill、CLI、VSCode 插件、`.devflow/devflow-cli-worker/` 文档、最新 `0.1.7` VSIX。不要提交 `.vscode/controlled-explorer.json`、`zzz-prompt-debug/`、session 测试附件、旧 VSIX 产物或 config.ts / .gitignore / tsconfig.json。

## 恢复指引

1. 先读 `state.md` 与 `checkpoints.md`。
2. 再读本 handoff 与 `spec/tasks.md`。
3. 需要完整脉络时读 `development-overview.md` 与 `decision-log.md`。
4. 下一项功能必须先进入 Align（需求对齐），不要在当前会话附件上继续试错。
