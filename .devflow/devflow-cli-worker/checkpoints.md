# devflow-cli-worker 检查点

## 2026-07-07 Skill + CLI 目录归并

- 当前路径与阶段：重型路径（Heavy Path） / Verify / Close（验证 / 收口）。
- 本轮完成内容：按用户选择的方案 1，将 CLI（Command Line Interface）从 `tools/devflow-cli-worker/` 移入 `.codex/skills/devflow-cli-worker/cli/`，让 Skill（Skill）目录成为完整能力包主目录；VSCode 插件（VSCode Extension）入口路径同步更新并重新打包 VSIX（VSCode Extension Package）。
- 问题现象：CLI 与 Skill 分散在不同目录，使用和维护时不够直观；验证时发现 `--help` 缺少显式成功路径。
- 问题原因：第一版按工具目录和技能目录分开落盘，路径引用散落在 Skill、README 和 VSCode 插件中；CLI 只在未知命令时报错列出可用命令，没有 help 分支。
- 解决方案：将 CLI 移入 `.codex/skills/devflow-cli-worker/cli/`，更新活动入口与文档路径，并补充 `--help` / `help` / `-h` 输出可用命令。
- 验证证据：`npm --prefix .codex/skills/devflow-cli-worker/cli test`、`npm --prefix vscode-extensions/devflow-cli-worker run compile`、`npm --prefix vscode-extensions/devflow-cli-worker test`、`node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs --help`、`npm --prefix vscode-extensions/devflow-cli-worker run package` 均通过。
- 风险与阻塞：VSIX 打包仍有既有非阻断警告：缺少 `repository` 字段和 LICENSE 文件；真实 Terminal.app / iTerm2 / VSCode 内置终端冒烟验证仍需补跑。
- 立即下一步：询问用户是否需要提交代码。

## 2026-07-07 真实 macOS CLI Worker 冒烟验证

- 当前路径与阶段：重型路径（Heavy Path） / Verify / Close（验证 / 收口）。
- 本轮完成内容：在真实 macOS 上验证 iTerm2（iTerm2）可见终端启动、tmux（tmux）attach、Codex CLI（Codex CLI）worker 启动、`/clear` 清空上下文、新对话发送消息和 result.md（Result File）写入。
- 问题现象：Codex TUI（Codex Terminal UI）中 `send` 能把文本输入到提示行，但实测稳定提交需要再发送一次 `key Enter`。
- 问题原因：Codex TUI 对通过 tmux（tmux）注入的文本与提交键处理不同于普通 shell；`send` 的文本输入可见，但首次 Enter 不一定完成提交。
- 解决方案：在 Skill（Skill）说明中补充 Codex CLI TUI 使用注意：`send` 后如文本未提交，执行 `key <worker-id> Enter`；本轮验证按该方式完成 `/clear` 和新对话任务。
- 验证证据：`start --id smoke-iterm2 --command bash --terminal iterm` 成功创建 attached tmux 会话并写入 `iterm2 smoke ok`；`start --id codex-smoke --command codex --terminal iterm` 成功启动 Codex CLI；`send codex-smoke "/clear"` + `key codex-smoke Enter` 后 Context 回到 100%；新对话写入 `.devflow/devflow-cli-worker/sessions/codex-smoke/result.md`，内容为 `codex worker smoke ok`。
- 风险与阻塞：VSCode 插件（VSCode Extension）已安装 VSIX 并通过编译 / 测试，但尚未完成命令面板触发内置终端的人工 UI 验证。
- 立即下一步：关闭测试 tmux 会话并询问用户是否需要提交代码。

## 2026-07-10 VSCode attach 桥接与 Codex 输入验证

- 当前路径与阶段：重型路径（Heavy Path） / Close（收口）。
- 本轮完成内容：实现 VSCode attach 桥接、单命令新建可见终端、tmux 鼠标支持、文本字面量发送、`clear` 与 slash 命令分层；最新 VSIX（VSCode Extension Package）为 `0.1.7`。
- 问题现象：tmux 注入 `/clear` 和普通提示词可能停留在 Codex 输入框；`send + key Enter` 与 `paste + key Enter` 均存在重复提交或两步竞态。
- 问题原因：tmux 未采用 `send-keys -l` 字面量模式，文本和 Enter 由多个外部调用拆分。
- 解决方案：Driver 使用字面量发送并在同一操作内受控提交；`clear` 验证 Context 100%，菜单型 slash 命令保留人工选择。
- 验证证据：CLI 测试、插件编译/测试、VSIX 打包、`git diff --check` 通过；真实 VSCode 与 Codex worker 完成任务 1、清空和任务 2。
- 立即下一步：提交本轮 mission 相关文件；后续增强从 backlog 单独进入 Align。
