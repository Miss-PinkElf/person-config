# devflow-cli-worker 决策日志

## 2026-07-04：采用重型路径（Heavy Path）

- 背景：用户明确要求走 `$devflow` 和重型流程，并要求记录本次开发。
- 决策：新建 `.devflow/devflow-cli-worker/` 作为本次 mission 真相源。
- 原因：需求跨平台、跨 Skill（Skill）与 CLI（CLI）边界，且涉及可见 subagent（Visible Subagent）、轮询（Polling）、交接（Handoff）和并行 worker（Parallel Workers），需要正式计划和规格管理。

## 2026-07-04：Windows 范围改为 WSL + VSCode 插件后再延期

- 背景：用户确认 Windows 原生适配和 PowerShell（pwsh）适配暂不做，后续会用 WSL（Windows Subsystem for Linux）开发。
- 决策：本轮不实现 Windows 外部终端控制（External Terminal Control），不适配 PowerShell（pwsh），也不实现 WSL（Windows Subsystem for Linux）入口或 VSCode 插件（VSCode Extension）；这些写入 `deferred/`。
- 原因：第一版先集中完成 macOS 的 tmux（tmux）可见 worker 闭环；WSL 与 VSCode 插件需要独立边界和后续验证。

## 2026-07-04：VSCode 插件第一版范围确认

- 背景：用户确认 VSCode 插件（VSCode Extension）第一版只需要“新开 WSL 终端（WSL Terminal）并启动 worker”，其它能力延期。
- 决策：将 VSCode 插件入口记录为完整延期项 `deferred/vscode-wsl-worker-entry.md`。
- 原因：该能力有明确后续价值，但不应进入当前 macOS 第一版主线。

## 2026-07-04：采用方案 A

- 背景：完成 macOS 第一版方案比较后，用户确认采用方案 A。
- 决策：本轮设计收敛为 tmux 核心（tmux Core）+ macOS 可见终端（Visible Terminal）+ macOS VSCode 终端入口（VSCode Terminal Entry）+ Skill 调度（Skill Orchestration）。
- 原因：该方案能稳定控制 worker，同时保留用户可见、可介入体验；比直接自动化终端更可维护，比本地服务 + UI 更适合作为第一版。

## 2026-07-04：macOS VSCode 插件入口纳入本轮

- 背景：用户确认 macOS 上的 VSCode 插件（VSCode Extension）需要写，用于在 VSCode 里启动终端。
- 决策：macOS VSCode 插件入口进入本轮；范围限定为新开 VSCode 内置终端（VSCode Integrated Terminal）并启动 worker。
- 原因：这属于 macOS 使用入口，不等同于 Windows / WSL 入口；管理 UI（User Interface）、状态列表、result.md 打开和轮询提醒仍延期。
