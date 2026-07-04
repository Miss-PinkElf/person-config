# devflow-cli-worker 工作流

## 当前目标

设计并实现 macOS 版 devflow CLI Worker（devflow CLI Worker）与 macOS VSCode 插件入口（VSCode Extension Entry）：用可见、可介入的独立 CLI 会话替代黑盒 subagent，让主 Agent（Main Agent）能观察、控制、轮询并读取 worker 产出。

## 当前路径

- 路径：重型路径（Heavy Path）
- 当前阶段：Close（当前轮次收口，正在提交相关文件）
- 触发原因：需求涉及技能（Skill）、命令行工具（CLI）、终端控制（Terminal Control）、会话记录（Session Records）、devflow 交接（Handoff）和延期项（Deferred Work）拆分，影响面较大且存在方案取舍。

## 范围

- macOS：本轮完整实现可见终端、会话控制、轮询、结果路径标注、多 worker 并行。
- macOS VSCode：本轮实现轻量 VSCode 插件（VSCode Extension）入口，只负责新开 VSCode 内置终端（VSCode Integrated Terminal）并启动 worker。
- Windows / WSL：本轮延期；不做 PowerShell（pwsh）原生适配，也不做 Windows 外部新开终端。Windows / WSL 的 VSCode 插件入口未来第一版只需新开 WSL 终端（WSL Terminal）并启动 worker。
- 文档：需要更新或新增面向使用者的 Skill（Skill）说明、CLI（CLI）命令说明和 devflow 记录。

## 暂定成功标准

- 明确 macOS 第一版能力边界。
- 将 WSL（Windows Subsystem for Linux）与 Windows / WSL VSCode 插件入口（VSCode Extension）写入 `deferred/`，作为完整延期项。
- 明确 result.md（Result File）等 session 附件的相对路径规则。
- 明确用户原始提示词（Original Prompt）在 prompt 组装中的保留方式。
- 明确 worker 状态轮询（Polling）、最长等待（Timeout）和多 worker 并行（Parallel Workers）策略。
- 在进入实现前完成 plan、proposal、design、tasks 的落盘。

## 下一步

提交本轮相关文件；下次继续时优先在 macOS 环境补跑真实终端冒烟验证。
