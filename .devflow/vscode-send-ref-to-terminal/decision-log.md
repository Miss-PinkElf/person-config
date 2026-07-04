# 决策日志（Decision Log）

## 2026-07-04：开启重型 devflow mission

- 决策：为 `vscode-send-ref-to-terminal` 创建新的 devflow mission，并按重型路径推进。
- 原因：用户明确要求 `$devflow` 和重型路径；当前仓库未发现插件源码，需要先对齐源码落点、跨平台策略和交付目标。
- 影响：在对齐（Align）、计划（Plan）、规格（Spec）完成前，不直接修改或创建插件实现代码。

## 2026-07-04：采用极简独立扩展方案

- 决策：采用方案 A，即极简独立扩展（Minimal Standalone Extension）。
- 原因：当前核心痛点明确，是把选中代码行引用发送到当前活动终端（Active Terminal）；配置项、终端识别和终端重命名都会增加第一版复杂度。
- 影响：第一版只实现 `@relative/path#Lx-y` 引用生成和 `terminal.sendText(text, false)` 发送；默认快捷键（Default Keybinding）按平台声明，引用路径统一使用 `/`。
