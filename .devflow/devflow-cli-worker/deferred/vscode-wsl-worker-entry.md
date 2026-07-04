# Windows / WSL VSCode Worker 入口延期项

## 暂不做的对象

Windows / WSL 的 VSCode 插件（VSCode Extension）入口：在 Windows 的 VSCode 中新开 WSL 终端（WSL Terminal），并自动启动 devflow CLI Worker（devflow CLI Worker）。

## 本轮不做的原因

- 用户确认先做 macOS 完整实现，WSL（Windows Subsystem for Linux）与 Windows / WSL 的 VSCode 插件入口（VSCode Extension Entry）先作为延期项。
- macOS VSCode 插件入口已纳入本轮，不属于本延期项。
- 本轮核心风险在 macOS 的 tmux（tmux）会话控制、可见终端（Visible Terminal）、轮询（Polling）、result.md（Result File）路径和多 worker 并行（Parallel Workers）。
- 若同时实现 VSCode 插件，会把范围扩展到 VSCode API、插件打包、终端 profile 选择和 Windows / WSL 路径转换，容易拖慢第一版核心闭环。

## 当前已有思路

- 插件第一版只做入口层，不做 worker 管理 UI（User Interface）。
- 入口能力限定为：读取当前 workspace，创建 VSCode 内置 WSL 终端（VSCode Integrated WSL Terminal），执行 worker 启动命令。
- worker 实际逻辑仍运行在 WSL 中，复用 macOS / Unix-like CLI（Unix-like CLI）能力。
- 插件不负责 `get-info`、状态轮询、result.md 打开、worker 列表或通知提醒；这些作为更后续增强。

## 后续触发条件

- macOS 版 CLI（CLI）与 Skill（Skill）已完成并验证核心闭环。
- 已确定 WSL 中的 worker 命令、session 目录、result.md 相对路径规则。
- 用户明确要在 Windows / VSCode 内开始使用该入口。

## 推荐进入阶段

- 先进入独立 Align（需求对齐）或 Mini Align。
- 若只做“新开 WSL 终端并启动 worker”，可按轻量路径（Light Path）推进。
- 若增加 worker 列表、状态查看、result.md 打开或轮询提醒，应升级为重型路径（Heavy Path）。
