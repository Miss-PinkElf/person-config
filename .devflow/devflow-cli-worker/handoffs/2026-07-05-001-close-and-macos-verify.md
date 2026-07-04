# devflow-cli-worker 交接记录

## 基础信息

- 创建时间：2026-07-05
- mission：devflow-cli-worker
- 当前阶段：Close（当前轮次收口，提交后等待 macOS 冒烟验证）
- handoff 编号：001
- 是否 superseded：否

## 当前目标

完成 macOS devflow CLI Worker（devflow CLI Worker）第一版：用 tmux（tmux）和可见终端替代黑盒 subagent，并提供 macOS VSCode 插件入口（VSCode Extension Entry）与配套 Skill（Skill）。

## 当前进度

- macOS CLI（CLI）第一版已实现。
- Worker Skill（Worker Skill）已写入 `.codex/skills/devflow-cli-worker/`。
- macOS VSCode 插件（VSCode Extension）入口已实现并打包 VSIX。
- Windows 当前环境已完成可执行验证。
- macOS 真实终端冒烟验证尚未执行。
- 收口提交：本提交（提交信息：实现 macOS 可见 CLI Worker 与 VSCode 入口；具体 hash 以 `git log -1` 为准）。

## 本轮完成内容

- [x] 初始化 `.devflow/devflow-cli-worker/` mission。
- [x] 读取并吸收 `zzz-prompt-debug/不让subagent黑盒/prompt-1.md` 和 `prompt-2.md`。
- [x] 按 `devflow 0.4.0` 补齐 `origin.md`、`state-history.md`、`deferred/`、`spec/`、`plans/`。
- [x] 将 Windows / WSL VSCode 入口写入延期项（Deferred Work）：`deferred/vscode-wsl-worker-entry.md`。
- [x] 实现 macOS CLI：`tools/devflow-cli-worker/`。
- [x] 实现 Worker Skill：`.codex/skills/devflow-cli-worker/`。
- [x] 实现 macOS VSCode 插件入口：`vscode-extensions/devflow-cli-worker/`。
- [x] 生成 VSIX：`vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.0.vsix`。
- [x] 补充本次 handoff 与下一次对话提示词。

## 关键决策与原因

| 决策 | 备选方案 | 原因 |
| --- | --- | --- |
| 采用方案 A：tmux 核心（tmux Core）+ macOS 可见终端（Visible Terminal）+ macOS VSCode 入口（VSCode Terminal Entry）+ Skill 调度（Skill Orchestration） | 直接自动化 Terminal.app / iTerm2；本地服务 + UI | tmux 控制更稳定，外部终端保持可见介入，复杂度适合第一版 |
| Windows 原生、PowerShell（pwsh）、WSL 入口延期 | 同步做 Windows / WSL 全套适配 | 当前用户会在 Mac 上完整使用，Windows 原生终端控制复杂度高；WSL 入口已有独立延期项 |
| macOS VSCode 插件入口纳入本轮 | 将所有 VSCode 插件都延期 | 用户明确需要在 Mac 的 VSCode 中新开终端启动 worker；该入口边界清晰 |
| VSCode 插件只做入口，不做管理 UI（User Interface） | 状态面板、result.md 打开、轮询提醒 | 第一版聚焦启动可见 worker，避免 UI 范围扩张 |

## 关键文件 / 产物

| 文件 | 作用 | 相关性 |
| --- | --- | --- |
| `tools/devflow-cli-worker/` | Node.js CLI（Node.js CLI）实现，管理 session、tmux、轮询、命令分发 | 核心实现 |
| `.codex/skills/devflow-cli-worker/SKILL.md` | 指导主 Agent（Main Agent）如何使用可见 worker | 核心使用规程 |
| `.codex/skills/devflow-cli-worker/references/prompt-template.md` | worker prompt 组装模板 | 确保 result.md 路径与原始提示词保留 |
| `vscode-extensions/devflow-cli-worker/` | macOS VSCode 插件（VSCode Extension）源码与打包产物 | VSCode 入口 |
| `vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.0.vsix` | 本地 VSCode 插件安装包（VSIX） | 可安装产物 |
| `.devflow/devflow-cli-worker/spec/tasks.md` | 已完成任务与验证证据 | 恢复和审查依据 |
| `.devflow/devflow-cli-worker/deferred/vscode-wsl-worker-entry.md` | Windows / WSL VSCode 入口延期项 | 后续范围边界 |

## 风险 / 阻塞项 / 开放问题

- [ ] 需要在 macOS 环境补跑 tmux（tmux）、Terminal.app / iTerm2、VSCode 内置终端真实冒烟验证。
- [ ] VSIX 打包仍有非阻断警告：缺少 `repository` 字段和 LICENSE 文件；如准备长期分发，应补齐。
- [ ] CLI 当前为第一版，命令参数解析较轻量；复杂 prompt 建议通过模板文件或后续 `--prompt-file` 增强。
- [ ] Windows / WSL VSCode 入口已延期，后续应单独进入 Align 或 Mini Align。

## 立即下一步

1. 在 macOS 上安装 / 运行 VSIX：`vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.0.vsix`。
2. 在 macOS 仓库根目录运行 CLI 冒烟验证：
   ```bash
   tmux -V
   node tools/devflow-cli-worker/bin/devflow-worker.mjs start --id smoke-a --command bash --prompt "echo ok > .devflow/devflow-cli-worker/sessions/smoke-a/result.md"
   node tools/devflow-cli-worker/bin/devflow-worker.mjs get-info smoke-a --tail 5
   node tools/devflow-cli-worker/bin/devflow-worker.mjs wait-agent smoke-a --timeout 60 --poll 5 --stale 10
   node tools/devflow-cli-worker/bin/devflow-worker.mjs kill smoke-a
   ```
3. 在 macOS VSCode 中执行命令 `Start devflow CLI Worker`，确认会新开内置终端并 attach 到 `tmux` 会话。
4. 如冒烟失败，优先检查 `tools/devflow-cli-worker/src/tmux-driver.mjs`、`macos-terminal.mjs` 和 `vscode-extensions/devflow-cli-worker/src/commandBuilder.ts`。

## 恢复指引

1. 默认先读 `.devflow/devflow-cli-worker/state.md`。
2. 再读 `.devflow/devflow-cli-worker/checkpoints.md`。
3. 需要恢复完整上下文时读本 handoff。
4. 需要理解方案演进时读 `plans/2026-07-04-macos-cli-worker-align.md`、`plans/2026-07-04-macos-cli-worker-plan.md`。
5. 需要执行或排查时读 `spec/tasks.md` 和对应源码目录。

## 可从活跃上下文移除的内容

- Windows / PowerShell（pwsh）原生适配讨论，已延期。
- WSL / Windows VSCode 入口讨论，已写入 `deferred/vscode-wsl-worker-entry.md`。
- 方案 A / B / C 对比过程，已沉淀到 Align、Plan 和 decision-log。
- `devflow 0.4.0` 结构迁移细节，已写入 state-history 和 checkpoint archive。
