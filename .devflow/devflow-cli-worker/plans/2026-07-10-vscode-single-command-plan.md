# VSCode 单命令启动计划

**目标：** 新增 `start-and-open-in-vscode`，一次完成 tmux worker 创建与 VSCode attach，减少正常 Skill（Skill）路径的 CLI 往返。

1. 在 CLI 分派中新增命令，复用 `start(..., "vscode")` 与 `openInVscode`；测试首次启动时调用 `newSession` 与 bridge，bridge 失败时保留 tmux session。
2. 更新 Skill 与 README，将 VSCode 默认启动改为单命令；保留旧命令兼容。
3. 提升插件版本、运行 CLI/插件验证并打包 VSIX。
