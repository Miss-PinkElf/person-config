# 孤立 tmux 会话（Orphaned tmux Session）处理对齐

## 目标

清理当前已确认的 5 个历史测试 tmux（tmux）会话，并防止 Worker CLI（Worker CLI）把“tmux 会话仍存在、CLI 会话元数据已缺失”的孤立会话误当成可复用 worker。

## 已确认的事实与范围

- 当前正常会话为 `clear-task-test-20260710`，已在 VSCode 内置终端运行，必须保留。
- 历史孤立会话为 `atomic-clear-test`、`macos-worker`、`mouse-smoke`、`speed-terminal-test`、`vscode-terminal-test`；它们均没有 `.devflow/devflow-cli-worker/sessions/<id>/cli-session.json`。
- 修复范围限于 Worker CLI 的 `ensure-in-vscode` 与 `open-in-vscode`。其它依赖 `readSession` 的命令已经会因元数据缺失而失败，不扩展为会话恢复系统。
- 不涉及 Windows / WSL（Windows Subsystem for Linux）、VSCode 插件（VSCode Extension）协议、自动重建元数据或批量清理功能。

## 方案比较

### 方案 A：检测后报错并给出清理指引（采用）

在 tmux 会话存在时，先校验 CLI Session Store（CLI 会话存储）的 `cli-session.json`。缺失则拒绝复用或 attach，并提示用户先清理对应 tmux 会话后重试。

- 优点：不改变、不中断用户可能仍在使用的真实终端；不会伪造 result.md（Result File）或 transcript 元数据。
- 缺点：用户需要执行一次显式清理。

### 方案 B：自动杀掉并重建 tmux 会话

检测到元数据缺失时，由 CLI 自动结束旧会话后重新启动。

- 优点：首次使用者无需额外操作。
- 缺点：可能杀掉仍被用户使用但元数据被误删的会话，破坏性过高。

### 方案 C：自动补造元数据

检测到元数据缺失时，根据 worker id 创建新的 `cli-session.json` 和附件。

- 优点：保留 tmux 进程。
- 缺点：无法可靠推断原始 command、prompt、状态和结果，容易把未知会话伪装成可控 worker。

## 采用设计

1. 提取一个内部校验：指定 worker id 的 tmux 会话存在时，必须能读取其 CLI 会话元数据。
2. `ensure-in-vscode` 在设置鼠标和输出“reused”前调用该校验；元数据缺失时不修改 tmux 会话，抛出包含 worker id、tmux session 名称及手工清理命令的错误。
3. `open-in-vscode` 在请求 VSCode attach 桥接（VSCode Attach Bridge）前调用同一校验；失败时不请求插件创建终端。
4. 保持元数据完整的复用行为不变：仍设置 `mouse on`，不创建第二个 tmux 会话，也不覆盖 result.md。
5. 手工清理只结束本次已确认的 5 个历史测试会话；不触碰 `clear-task-test-20260710` 或任何其它 tmux 会话。

## 验收与验证

- 为 `ensure-in-vscode` 添加“tmux 存在、元数据缺失”测试：命令失败，且不会创建新会话或设置鼠标。
- 为 `open-in-vscode` 添加同一场景测试：命令失败，且不会调用桥接。
- 保留现有“元数据完整时复用”的回归断言。
- 运行 `npm --prefix .codex/skills/devflow-cli-worker/cli test`。
- 在真实环境验证：清理 5 个已列出的孤立会话；之后运行 `ensure-in-vscode --id macos-worker --command codex`，确认它创建新的元数据与 tmux 会话；再次运行确认正常复用。
- 运行 `git diff --check`，并核对当前可见测试 worker 未被清理。

## 非目标

- 不自动终止任何会话。
- 不从 tmux 缓冲区恢复旧 worker 的 prompt、transcript 或 result.md。
- 不修改 VSCode 插件、VSIX（VSCode Extension Package）或 Windows / WSL 逻辑。
