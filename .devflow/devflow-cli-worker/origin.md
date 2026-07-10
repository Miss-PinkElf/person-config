# 原始输入索引（Origin）

## 定位

本文件记录当前 mission 的原始提示词、需求草稿和参考文件来源。它允许追加，不是冻结文件。

## 来源列表

| 序号 | 来源路径 | 时间 | 用途 | 吸收状态 |
| --- | --- | --- | --- | --- |
| 1 | `zzz-prompt-debug/不让subagent黑盒/prompt-1.md` | 2026-07-04 | 初始需求草稿：可见 subagent（Visible Subagent）、Skill + CLI、轮询、result.md 路径、多 worker 并行 | 已吸收到 Align |
| 2 | `zzz-prompt-debug/不让subagent黑盒/prompt-2.md` | 2026-07-04 | 核心思路文档：tmux（tmux）方案、命令速查、session 附件、macOS 可见性层 | 已吸收到 Align |
| 3 | 用户补充：Windows 范围收窄 | 2026-07-04 | 明确不做 PowerShell（pwsh）和 Windows 外部终端，后续使用 WSL（Windows Subsystem for Linux） | 已吸收到决策日志 |
| 4 | 用户补充：VSCode 插件延期 | 2026-07-04 | 明确 VSCode 插件（VSCode Extension）第一版只需新开 WSL 终端并启动 worker，但本轮先做 macOS，WSL / VSCode 作为延期项 | 已写入 deferred |
| 5 | 用户收尾指令：上下文过长，生成 handoff 并直接提交 | 2026-07-05 | 要求回顾本次对话、更新未收口文档、生成交接并提交当前 mission 相关文件 | 已吸收到 handoff 与收口记录 |
| 6 | 用户补充：CLI + Skill 放在一起 | 2026-07-07 | 选择方案 1，将 CLI（Command Line Interface）移入 `.codex/skills/devflow-cli-worker/cli/`，让 Skill（Skill）目录成为完整能力包主目录 | 已吸收到 plan、Skill、VSCode 插件路径和检查点 |
| 7 | 用户补充：用 CLI 验证 Codex worker | 2026-07-07 | 明确优先测试 CLI + Skill 主路径：启动 Codex CLI（Codex CLI）、发送 `/clear`、新开对话并写入 result.md（Result File） | 已吸收到 bug-log、state、checkpoint 与 handoff |
| 8 | 用户补充：VSCode 可见终端、CLI attach 桥接与鼠标交互 | 2026-07-10 | 要求 CLI 启动并在 VSCode 新建指定 worker 终端、默认启用鼠标、验证多轮对话与 `/clear` | 已吸收到 Skill、CLI、插件、spec 与本次 handoff |

## 备注

- 原始 prompt 已在仓库文件中，不复制全文。
- 本 mission 记录路径统一使用相对路径。
