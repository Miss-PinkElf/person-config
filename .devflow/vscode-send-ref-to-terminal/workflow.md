# vscode-send-ref-to-terminal 工作流（Workflow）

## 当前目标

开发或恢复 VS Code 插件（VS Code Extension）`vscode-send-ref-to-terminal`，用于把编辑器选中的代码行引用发送到当前活动终端（Active Terminal），解决 Claude Code 内置快捷键在多终端场景下发送目标不稳定的问题。

## 当前路径

重型路径（Heavy Path）。

选择原因：

- 用户明确要求使用 `$devflow` 并走重型路径。
- 当前仓库未发现既有扩展源码，需要先确认是重建、迁移还是补齐。
- 需求涉及插件结构、快捷键（Keybinding）、跨平台行为（Cross-platform Behavior）、打包验证（Packaging Verification）等多个阶段。

## 当前阶段

当前轮次收尾（Close / Handoff）。

## 当前范围

- 第一版插件已完成源码、测试、打包与 devflow 记录。
- 本轮收尾只处理当前 mission 相关文件，不触碰仓库中其他未提交改动。
- 后续如继续推进，优先做 VSIX 手动安装验证或补齐发布元数据。

## 阶段门禁

- 未完成对齐（Align）前，不进入计划（Plan）。
- 未落盘计划（Plan）前，不进入规格（Spec）或实施（Apply）。
- 未具备 `spec/proposal.md`、`spec/design.md`、`spec/tasks.md` 前，不进入正式实施（Apply）。

## 下一步

新对话根据 `NEXT-SESSION-PROMPT-vscode-send-ref-to-terminal.md` 恢复；优先处理 VSIX 手动安装验证。
