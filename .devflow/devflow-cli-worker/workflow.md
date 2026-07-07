# devflow-cli-worker 工作流

## 当前目标

收口 macOS 版 devflow CLI Worker（devflow CLI Worker）第一版：CLI（Command Line Interface）已归并到 Skill（Skill）主包，并在真实 macOS 上验证 iTerm2（iTerm2）与 Codex CLI（Codex CLI）worker 主链路。

## 当前路径

- 路径：重型路径（Heavy Path）
- 当前阶段：Close（当前轮次收口，正在生成 handoff 并提交相关文件）
- 触发原因：需求涉及技能（Skill）、命令行工具（CLI）、终端控制（Terminal Control）、会话记录（Session Records）、devflow 交接（Handoff）和延期项（Deferred Work）拆分，影响面较大且存在方案取舍。

## 范围

- macOS：本轮完整实现可见终端、会话控制、轮询、结果路径标注、多 worker 并行；真实 iTerm2 与 Codex CLI worker 主链路已验证。
- macOS VSCode：本轮实现轻量 VSCode 插件（VSCode Extension）入口，只负责新开 VSCode 内置终端（VSCode Integrated Terminal）并启动 worker；命令面板 UI 触发验证可后续人工补跑。
- Windows / WSL：本轮延期；不做 PowerShell（pwsh）原生适配，也不做 Windows 外部新开终端。Windows / WSL 的 VSCode 插件入口未来第一版只需新开 WSL 终端（WSL Terminal）并启动 worker。
- 文档：Skill（Skill）说明、CLI（CLI）命令说明、devflow 记录和本轮 handoff 已更新或正在收口。

## 暂定成功标准

- 明确 macOS 第一版能力边界。
- 将 WSL（Windows Subsystem for Linux）与 Windows / WSL VSCode 插件入口（VSCode Extension）写入 `deferred/`，作为完整延期项。
- 明确 result.md（Result File）等 session 附件的相对路径规则。
- 明确用户原始提示词（Original Prompt）在 prompt 组装中的保留方式。
- 明确 worker 状态轮询（Polling）、最长等待（Timeout）和多 worker 并行（Parallel Workers）策略。
- 完成 macOS CLI + Skill 主链路验证，并记录 Codex CLI TUI（Codex CLI Terminal UI）需要 `send` 后补 `key Enter` 的实测注意点。

## 下一步

提交本轮相关文件；下次如继续，可优先补跑 VSCode 插件（VSCode Extension）命令面板触发内置终端的人工 UI 验证，或处理 `--prompt-file`、VSIX 分发元数据等延期增强。
