# VSCode 默认终端与 Codex 提交协议计划

**目标：** Skill（Skill）在 VSCode 场景默认创建新 worker 终端，Codex CLI（Codex CLI）统一通过 `paste + key Enter` 提交，避免 `send` 与额外 Enter 重复提交。

1. 更新 Skill 与 CLI README：VSCode 启动使用 `start-in-vscode -> open-in-vscode`；保留同一 worker id 的 attach 复用。
2. 明确 `send` 仅用于一次提交；Codex `/clear` 和任务提示词使用 `paste` 后仅发送一次 `key Enter`。
3. 发布版本 `0.1.3`，重新打包 VSIX。
4. 启动可见 Codex worker，使用一次 `paste /clear + key Enter` 后发送两个任务，验证 result.md 与屏幕状态。
