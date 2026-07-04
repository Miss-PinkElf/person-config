# 状态历史（State History）

## 2026-07-04 初始 Align 快照归档

### 当前快照

- Mission：devflow-cli-worker
- 路径：重型路径（Heavy Path）
- 阶段：Align（需求对齐）
- 当前请求来源：`zzz-prompt-debug/不让subagent黑盒/prompt-1.md`、`zzz-prompt-debug/不让subagent黑盒/prompt-2.md`
- 当前平台约束：用户当前电脑是 Windows，但本任务不再适配 PowerShell（pwsh）；Windows 侧暂时通过 WSL（Windows Subsystem for Linux）开发，并由 VSCode 插件（VSCode Extension）新开 WSL 终端（WSL Terminal）。

### 已确认事实

- 仓库当前没有现成的 `devflow-cli-worker` 实现或同名 mission。
- 需求核心是避免 subagent 黑盒化：让 worker CLI（Worker CLI）像真人在终端里操作，主 Agent（Main Agent）可以观察、控制、轮询和读取结果。
- macOS 必须完整实现；Windows 不做原生 PowerShell（pwsh）适配，也不做外部终端控制，只要求 VSCode 插件（VSCode Extension）能新开 WSL 终端（WSL Terminal）运行 worker。
- 不能直接进入实现；需要先完成 Align、Plan、Spec / Tasks。

### Align 分析摘要

- macOS 可按原始需求完整设计：tmux（tmux）负责可控会话，外部终端（External Terminal）负责可见介入，CLI（CLI）负责 capture / send / wait / transcript / result 路径管理。
- Windows 不再设计原生驱动（Native Windows Driver）；第一版只考虑 VSCode 插件（VSCode Extension）调用 VSCode API 新建 WSL 终端（WSL Terminal）。
- CLI（CLI）主能力优先面向类 Unix 环境（Unix-like Environment），Windows 用户通过 WSL（Windows Subsystem for Linux）运行同一套 worker 能力。
- result.md（Result File）必须由 CLI 创建并在 prompt 中以相对路径明确标注，避免 worker 找不到输出位置。
- 多 worker 并行（Parallel Workers）应以 session 目录隔离，不共享可变文件；主 Agent 通过轮询 get-info 获取轻量状态。

### 归档原因

`devflow 0.4.0` 要求 `state.md` 保持短当前态，旧快照如仍有价值则归档到 `state-history.md`。
