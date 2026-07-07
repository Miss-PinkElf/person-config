# devflow CLI Worker Tasks

## 任务状态

- [x] Task 1：实现 CLI Session Store（CLI Session Store）
- [x] Task 2：实现 tmux Driver（tmux Driver）
- [x] Task 3：实现 macOS Terminal Opener（macOS Terminal Opener）
- [x] Task 4：实现 wait-agent 轮询（wait-agent Polling）
- [x] Task 5：实现 CLI Commands（CLI Commands）
- [x] Task 6：新增 Worker Skill（Worker Skill）
- [x] Task 7：新增 macOS VSCode 插件入口（macOS VSCode Extension Entry）
- [x] Task 8：新增 README 并执行验证（README and Verification）

## 验收标准

- CLI 逻辑测试通过：`npm --prefix .codex/skills/devflow-cli-worker/cli test`
- VSCode 插件编译通过：`npm --prefix vscode-extensions/devflow-cli-worker run compile`
- VSCode 插件测试通过：`npm --prefix vscode-extensions/devflow-cli-worker test`
- Skill 文档包含触发语、启动流程、轮询流程、result.md 路径规则。
- README 明确 macOS 依赖与 Windows / WSL 限制。
- macOS iTerm2（iTerm2）与 Codex CLI（Codex CLI）worker 主链路冒烟验证通过。
- VSCode 插件（VSCode Extension）UI 命令面板触发验证可后续人工补跑，不阻塞 CLI + Skill 主链路收口。

## 验证证据

- 2026-07-04：`npm --prefix tools/devflow-cli-worker test` 通过。
- 2026-07-04：`npm --prefix vscode-extensions/devflow-cli-worker run compile` 通过。
- 2026-07-04：`npm --prefix vscode-extensions/devflow-cli-worker test` 通过。
- 2026-07-04：`npm --prefix vscode-extensions/devflow-cli-worker run package` 通过，生成 `vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.0.vsix`。
- 2026-07-04：`Select-String -Path '.codex/skills/devflow-cli-worker/SKILL.md' -Pattern '黑盒|worker|result.md|轮询|devflow'` 命中触发语。
- 2026-07-05 收尾复核：上述 CLI 测试、VSCode 编译、VSCode 测试、VSIX 打包和 Skill 触发语检查再次通过。
- 2026-07-07：CLI 迁入 `.codex/skills/devflow-cli-worker/cli/` 后，`npm --prefix .codex/skills/devflow-cli-worker/cli test` 通过。
- 2026-07-07：`npm --prefix vscode-extensions/devflow-cli-worker run compile`、`npm --prefix vscode-extensions/devflow-cli-worker test`、`npm --prefix vscode-extensions/devflow-cli-worker run package` 通过；VSIX 打包仍有既有非阻断警告：缺少 `repository` 字段和 LICENSE 文件。
- 2026-07-07：真实 macOS iTerm2（iTerm2）路径通过：`start --id smoke-iterm2 --command bash --terminal iterm` 创建 attached tmux（tmux）会话并写入 result.md。
- 2026-07-07：真实 Codex CLI（Codex CLI）worker 路径通过：`start --id codex-smoke --command codex --terminal iterm` 启动成功；通过 `send` 输入 `/clear` 并使用 `key Enter` 提交，完成清空上下文、新对话和 result.md 写入。
