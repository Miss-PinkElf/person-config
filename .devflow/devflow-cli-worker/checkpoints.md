# devflow-cli-worker 检查点

## 2026-07-10 孤立 tmux 会话保护收口

- 当前路径与阶段：重型路径（Heavy Path） / Close（收口）。
- 本轮完成内容：清理 5 个历史测试孤立 tmux（tmux）会话，保留 `clear-task-test-20260710`；Session Store（会话存储）读取时校验元数据归属并忽略额外字段；`ensure-in-vscode` 与 `open-in-vscode` 在副作用前拒绝缺失或错配元数据。
- 问题现象：存活的 tmux 会话因 session 附件缺失会被错误复用；可解析但错配的元数据还可能使控制命令指向其它 tmux 会话。
- 问题原因：复用只判断 tmux 是否存在，Session Store（会话存储）允许 JSON 覆盖按 worker id 推导的会话字段。
- 解决方案：元数据缺失时给出精确 `tmux kill-session` 指引且不自动终止会话；元数据错配时拒绝操作。worker id、tmux session 名称、相对 session 路径和 result 路径必须与预期一致。
- 验证证据：`npm --prefix .codex/skills/devflow-cli-worker/cli test` 的 6 组测试全部通过；真实缺失元数据会话被拒绝且仍存活，随后显式清理；`macos-worker` 重新创建、`get-info` 成功、二次 ensure 显示 reused、VSCode attach 成功。
- 风险与阻塞：当前正常 worker 为 `clear-task-test-20260710` 与 `macos-worker`，对应 session 附件未跟踪且不应提交；VSIX 的 repository 和 LICENSE 警告、菜单型 slash 命令自动化仍是既有非阻断事项。
- 立即下一步：本轮已提交；新功能从 backlog 选择后进入 Align（需求对齐）。

## 2026-07-10 VSCode 任务 1 -> clear -> 任务 2 回归验证

- 当前路径与阶段：重型路径（Heavy Path） / Close（收口）。
- 本轮完成内容：通过 `start-and-open-in-vscode` 启动 `clear-task-test-20260710`，在 VSCode 内置终端完成任务 1 写入、专用 `clear` 确认 Context 100%、任务 2 追加写入；Worker CLI（Worker CLI）单元测试 6 组全部通过。
- 问题现象：默认 `macos-worker` 的历史 tmux（tmux）会话可被 `ensure-in-vscode` 复用，但对应 cli-session.json 已缺失，导致后续 CLI 操作报 ENOENT。
- 问题原因：复用判定只检查 tmux 会话，不检查 CLI Session Store（CLI 会话存储）元数据；未跟踪的 session 附件已被移除而 tmux 会话仍存活。
- 解决方案：本次使用唯一的新 worker 完成验证，保留历史会话不做破坏性清理；后续已采用拒绝复用并显式清理的策略。
- 验证证据：屏幕先后显示“任务1已写入”、`Context 100% left`、任务 2 的 shell 追加命令与“任务2已写入”；`.devflow/devflow-cli-worker/sessions/clear-task-test-20260710/result.md` 包含两行完成标记；`npm --prefix .codex/skills/devflow-cli-worker/cli test` 全部通过。
- 风险与阻塞：`clear-task-test-20260710` 终端与未跟踪 session 附件仍保留，供用户观察，不应提交；后续修复已在本轮完成。
- 立即下一步：收口孤立会话保护并询问用户是否需要提交代码。

## 2026-07-10 VSCode attach 桥接与 Codex 输入验证

- 当前路径与阶段：重型路径（Heavy Path） / Close（收口）。
- 本轮完成内容：实现 VSCode attach 桥接、单命令新建可见终端、tmux 鼠标支持、文本字面量发送、`clear` 与 slash 命令分层；最新 VSIX（VSCode Extension Package）为 `0.1.7`。
- 问题现象：tmux 注入 `/clear` 和普通提示词可能停留在 Codex 输入框；`send + key Enter` 与 `paste + key Enter` 均存在重复提交或两步竞态。
- 问题原因：tmux 未采用 `send-keys -l` 字面量模式，文本和 Enter 由多个外部调用拆分。
- 解决方案：Driver 使用字面量发送并在同一 CLI 操作内受控提交；`clear` 验证 Context 100%，菜单型 slash 命令保留人工显式选择。
- 验证证据：CLI 测试、插件编译/测试、VSIX 打包、`git diff --check` 通过；真实 VSCode 与 Codex worker 完成任务 1、清空和任务 2。
- 立即下一步：后续增强从 backlog 单独进入 Align。
