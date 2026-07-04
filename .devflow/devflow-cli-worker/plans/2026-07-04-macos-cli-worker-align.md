# macOS devflow CLI Worker 对齐文档

## 结论

本轮采用方案 A：tmux 核心（tmux Core）+ macOS 可见终端（Visible Terminal）+ macOS VSCode 终端入口（VSCode Terminal Entry）+ Skill 调度（Skill Orchestration）。

主 Agent（Main Agent）通过 devflow Worker CLI（devflow Worker CLI）启动并控制独立 worker。CLI 创建 tmux 会话（tmux Session），在会话中启动 `codex` / `claude` / shell，并通过 iTerm2 / Terminal.app 打开可见终端窗口。macOS VSCode 插件（VSCode Extension）提供轻量入口，可在 VSCode 内置终端（VSCode Integrated Terminal）启动 worker。用户可以直接观察、介入、打断或接管 worker；主 Agent 通过 CLI 命令获取状态、发送输入、轮询等待和读取结果。

## 目标

- 解决 subagent 黑盒问题，让 worker 变成可见、可介入的 CLI 会话。
- 在 macOS 上完整实现可见终端、tmux 会话控制、状态捕获、轮询等待、结果文件和多 worker 并行。
- 在 macOS VSCode 中提供插件入口，允许用户从 VSCode 内新开终端并启动 worker。
- 提供配套 Skill（Skill），指导主 Agent 如何启动 worker、组装 prompt、轮询状态、读取 result.md（Result File）和记录交接。
- 保留用户原始提示词（Original Prompt），不改写、不吞掉关键信息。

## 非目标

- 本轮不做 Windows 原生适配。
- 本轮不做 PowerShell（pwsh）适配。
- 本轮不做 WSL（Windows Subsystem for Linux）入口。
- 本轮不做 Windows / WSL 的 VSCode 插件入口。
- 本轮不做 worker 管理 UI（User Interface）。

WSL 与 Windows VSCode 插件入口已记录为延期项：`deferred/vscode-wsl-worker-entry.md`。macOS VSCode 插件入口进入本轮，但第一版只负责新开 VSCode 终端并启动 worker，不做管理 UI。

## 第一版能力边界

### CLI 命令

第一版 CLI（CLI）至少覆盖：

- `start`：创建 worker、session 目录和 tmux 会话，并打开 macOS 可见终端。
- `start-in-vscode`：为 macOS VSCode 插件提供稳定入口，在 VSCode 内置终端中启动 worker。
- `send <id> <message>`：向 worker 发送消息并提交。
- `paste <id> <text>`：向 worker 粘贴文本但不提交。
- `get-info <id> --tail N`：返回 worker 元数据和最近 N 行屏幕文本。
- `capture <id>`：捕获完整屏幕文本到 session 附件。
- `wait-agent <id>`：基于屏幕 diff 轮询等待，默认最长 20 分钟、15 秒轮询、30 秒稳定视为 stale。
- `interrupt <id>`：发送 Ctrl+C。
- `key <id> <key>`：发送单个按键。
- `kill <id>`：终止 tmux 会话，不删除 session 文件。
- `status <id>`：查看 session 元数据。
- `transcript <id>`：查看操作日志。

### Session 目录

每个 worker 使用独立目录：

```text
.devflow/devflow-cli-worker/sessions/<worker-id>/
├── cli-session.json
├── result.md
├── transcript.log
├── screen.txt
└── prompt.md
```

路径原则：

- prompt 中必须明确写入 `result.md` 的相对路径。
- worker 输出以 `result.md` 为正式结果文件。
- `cli-session.json` 记录 worker id、tmux session name、创建时间、命令、状态和结果路径。
- `transcript.log` 记录主 Agent 对 worker 的控制操作与关键状态。
- `screen.txt` 保存最近一次捕获屏幕。

### Prompt 组装

Skill（Skill）负责指导主 Agent 组装 prompt，CLI 只负责必要占位符替换和发送。

prompt 必须包含：

- 用户原始提示词（Original Prompt），保持原文。
- worker id。
- `result.md` 相对路径。
- 任务边界、输出要求和必要的 devflow 记录约束。
- 完成时必须把结论写入 `result.md` 的要求。

## 多 worker 并行

多 worker 并行（Parallel Workers）通过 session 目录隔离实现：

- 每个 worker 独立 tmux 会话。
- 每个 worker 独立 result.md 和 transcript.log。
- 主 Agent 不使用多个 `wait-agent` 长阻塞并发等待。
- 推荐用 `get-info --tail 5` 对多个 worker 做轻量轮询，再决定是否 send、interrupt 或读取 result.md。

## 等待与轮询

`wait-agent` 不依赖 agent TUI（Terminal UI）的固定文案，而使用 diff-based 等待：

- 屏幕持续变化：认为 worker 仍在工作。
- 屏幕稳定超过 stale 阈值：返回 stale，让主 Agent 判断是否完成、卡住或需要介入。
- 默认参数：`--timeout 1200`、`--poll 15`、`--stale 30`。

如果要处理授权提示或异常，主 Agent 应使用更短周期的 `get-info` / `capture` 轮询，而不是盲等 20 分钟。

## Skill 职责

Skill（Skill）不是实现控制逻辑的地方，而是使用规程：

- 何时启动 worker。
- 如何选择 worker id 和 session 目录。
- 如何组装 prompt。
- 如何轮询、如何判断 stale、如何处理授权提示。
- 如何读取 result.md 并把结论回写到当前 devflow mission。
- 如何在上下文过长时生成 worker 交接说明。

## macOS VSCode 插件职责

macOS VSCode 插件（VSCode Extension）第一版只做入口层：

- 提供命令：在 VSCode 内启动 devflow worker。
- 新开 VSCode 内置终端（VSCode Integrated Terminal）。
- 在终端中执行 CLI 的 `start-in-vscode` 后自动 `tmux attach` 到 worker 会话。
- 不做 worker 列表、状态面板、result.md 打开、轮询提醒或 Windows / WSL 适配。

## 错误处理

第一版至少覆盖：

- tmux（tmux）未安装：返回明确安装提示。
- worker id 已存在：拒绝覆盖或要求显式 `--reuse`。
- tmux session 不存在：提示 session 文件与进程状态不一致。
- result.md 缺失：在 `start` 时预创建，并在 prompt 中标注路径。
- 外部终端打开失败：保留 tmux session，并提示用户可手动 attach。

## 测试思路

- CLI 单元/脚本级验证：session 目录创建、占位符替换、metadata 写入。
- macOS 手工冒烟验证：`start` 能创建 tmux 会话并打开可见终端。
- 轮询验证：模拟屏幕变化与稳定，验证 `wait-agent` 返回状态。
- 多 worker 验证：启动两个 worker，确认 session 文件互不覆盖。
- Skill 验证：用 2-3 个真实 prompt 检查是否明确 result.md 路径、保留原始提示词并给出轮询流程。

## 延期项

- WSL / Windows VSCode 插件入口：`deferred/vscode-wsl-worker-entry.md`
- worker 管理 UI（User Interface）
- VSCode 中查看 result.md、状态列表、轮询提醒
- Windows 原生 PowerShell（pwsh）适配

## 进入 Plan 的条件

- 用户已确认方案 A。
- 本文档无未解决的核心范围问题。
- 下一步进入 Plan（计划）阶段，拆分 CLI、Skill、文档和验证任务。
