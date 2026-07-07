# 首版后延期项（Post V1 Deferred Scope）

## 定位

本文件记录本次对话中未深入讨论、适合放到第一版之后再明确的能力。当前首版已经按提示词实现了 22 项能力，但以下事项需要真实使用反馈后再决定是否进入第二版。

## 延期项

### 发布准备（Marketplace Readiness）

- 问题现象：`vsce package` 当前提示缺少 `repository` 和 `LICENSE`。
- 问题原因：本轮目标是本地可安装 VSIX，不是正式发布 Visual Studio Marketplace。
- 解决方案：如后续准备发布，补充 `repository`、`LICENSE`、图标、版本策略和发布说明。

### 远程环境支持（Remote SSH / WSL / Codespaces）

- 问题现象：首版未专项验证远程开发环境。
- 问题原因：VS Code 远程文件系统行为与本地文件系统不同，拖拽、终端路径和系统文件管理器显示可能需要额外处理。
- 解决方案：在用户实际需要远程场景时单独开任务验证和适配。

### 全局打开频率统计（Global Open Frequency）

- 问题现象：首版频率排序只统计受控树内打开行为。
- 问题原因：统计原生 Explorer、编辑器标签页或全局文件打开行为需要更复杂的事件订阅和口径定义。
- 解决方案：先观察受控树内频率排序是否满足需求，再决定是否扩展统计范围。

### 更完整的 Explorer 能力（Full Explorer Parity）

- 问题现象：首版未实现 Git 状态、搜索、永久删除、复杂多选操作等完整 Explorer 复刻能力。
- 问题原因：插件定位是受控第二文件管理器（Controlled Explorer），不是完整替代原生 Explorer。
- 解决方案：保持首版轻边界；只有明确需要时再逐项增加。
