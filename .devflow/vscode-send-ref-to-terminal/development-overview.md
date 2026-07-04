# vscode-send-ref-to-terminal 总记录（Development Overview）

## 定位

本文件用于理解完整开发过程，不是默认恢复热路径。日常恢复优先读 `state.md` 与 `checkpoints.md`。

## 背景

用户希望用 VS Code 插件（VS Code Extension）替代 Claude Code 内置代码引用快捷键，避免多个 Claude Code 终端存在时引用发送到非当前活动终端。

## 本轮完成阶段

- Mission Init：创建 `.devflow/vscode-send-ref-to-terminal/` 真相源。
- Align：确认采用极简独立扩展（Minimal Standalone Extension）。
- Plan：落盘 `plans/2026-07-04-send-ref-to-terminal-plan.md`。
- Spec：创建 `spec/proposal.md`、`spec/design.md`、`spec/tasks.md`。
- Apply：创建插件源码与 VSIX 安装包。
- Verify：`npm run compile`、`npm test`、`npm run package` 均通过。
- Handoff：创建收尾交接，方便新对话继续。

## 关键决策

- 核心逻辑不区分 Windows/macOS/Linux，使用 VS Code Extension API 统一实现。
- 默认快捷键（Default Keybinding）按平台声明。
- 引用路径（Reference Path）统一使用 `/`。
- 第一版不做终端识别、终端自动重命名、多选区和配置项。

## 当前开放问题

- 尚未做 VS Code 手动安装验证。
- `vsce` 提示缺少 `repository` 字段和 LICENSE 文件，正式发布前可补齐。

## 推荐读取策略

- 快速恢复：读 `state.md`、`checkpoints.md`。
- 继续安装验证：再读 `handoffs/2026-07-04-001-close-ready.md`。
- 追溯延期范围：读 `backlog.md` 和 `deferred/`。
