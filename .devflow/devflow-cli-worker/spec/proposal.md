# devflow CLI Worker Proposal

## 背景

当前 Claude / Codex CLI 调用 subagent 时，subagent 对用户和主 Agent（Main Agent）都偏黑盒：看不到实时终端状态，无法中途介入、打断或纠偏。用户希望用可见、可介入的 CLI worker 替代黑盒 subagent。

## 目标

- 实现 macOS devflow Worker CLI（devflow Worker CLI）。
- 使用 tmux（tmux）创建可控 worker 会话。
- 使用 Terminal.app / iTerm2 打开可见终端，允许用户介入。
- 提供 macOS VSCode 插件入口（VSCode Extension Entry），在工作区打开后自动在 VSCode 内置终端（VSCode Integrated Terminal）启动或复用默认 worker。
- 允许 Worker CLI（Worker CLI）请求 VSCode 插件打开或聚焦指定 worker id 的内置终端。
- 提供 Skill（Skill）说明，指导主 Agent 组装 prompt、轮询状态、读取 result.md（Result File）并回写 devflow。

## 范围

- CLI 命令：`start`、`start-in-vscode`、`ensure-in-vscode`、`open-in-vscode`、`send`、`paste`、`get-info`、`capture`、`wait-agent`、`interrupt`、`key`、`kill`、`status`、`transcript`。
- Session 附件：`cli-session.json`、`result.md`、`prompt.md`、`transcript.log`、`screen.txt`。
- diff-based 等待机制（diff-based wait）：默认 20 分钟 timeout、15 秒 poll、30 秒 stale。
- macOS VSCode 插件入口：工作区打开后自动新开终端，调用 `ensure-in-vscode` 启动或复用默认 `macos-worker`，并 attach 到对应 tmux（tmux）会话；手动命令入口保留给其它 worker id。
- VSCode attach 桥接（VSCode Attach Bridge）：插件通过工作区内 Unix Socket（Unix 域套接字）接收 `open-in-vscode` 请求，创建或聚焦指定 worker 的 attach 终端；CLI 继续直接控制 tmux（tmux）。
- Windows 当前环境仅做静态/单元验证；macOS 终端冒烟验证后续在 Mac 上执行。

## 非目标

- 不做 Windows 原生适配。
- 不做 PowerShell（pwsh）适配。
- 不做 WSL（Windows Subsystem for Linux）入口。
- 不做 Windows / WSL VSCode 入口。
- 不做 worker 管理 UI（User Interface）。
- 不做 VSCode 状态列表、打开 result.md、轮询提醒。

## 边界场景

- tmux 未安装：CLI 返回中文错误，提示安装 tmux。
- 外部终端打开失败：保留 tmux session，提示用户可手动 attach。
- result.md 缺失：`start` 时预创建，prompt 中显式写入相对路径。
- worker id 非法：拒绝创建，避免路径注入和 session 冲突。
- VSCode 插件未就绪或 socket 不存在：`open-in-vscode` 返回中文错误，不使用键盘模拟作为回退。
- VSCode 打开多个窗口：每个窗口可创建 attach 终端，但同名 tmux session 只启动一个 Codex CLI（Codex CLI）worker。
- 同名 tmux session 存在但 session 附件缺失：允许 attach，不覆盖运行中 worker 的附件。
- 当前环境是 Windows：只能跑 Node / TypeScript 逻辑测试，不能宣称 macOS 冒烟验证通过。

## 延期项

- Windows / WSL VSCode Worker 入口：`../deferred/vscode-wsl-worker-entry.md`
- worker 管理 UI（User Interface）
- VSCode result.md 查看与状态提醒
