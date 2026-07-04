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

- CLI 逻辑测试通过：`npm --prefix tools/devflow-cli-worker test`
- VSCode 插件编译通过：`npm --prefix vscode-extensions/devflow-cli-worker run compile`
- VSCode 插件测试通过：`npm --prefix vscode-extensions/devflow-cli-worker test`
- Skill 文档包含触发语、启动流程、轮询流程、result.md 路径规则。
- README 明确 macOS 依赖与 Windows / WSL 限制。
- 最终说明中明确 macOS 冒烟验证尚需在 Mac 环境执行。

## 验证证据

- 2026-07-04：`npm --prefix tools/devflow-cli-worker test` 通过。
- 2026-07-04：`npm --prefix vscode-extensions/devflow-cli-worker run compile` 通过。
- 2026-07-04：`npm --prefix vscode-extensions/devflow-cli-worker test` 通过。
- 2026-07-04：`npm --prefix vscode-extensions/devflow-cli-worker run package` 通过，生成 `vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.0.vsix`。
- 2026-07-04：`Select-String -Path '.codex/skills/devflow-cli-worker/SKILL.md' -Pattern '黑盒|worker|result.md|轮询|devflow'` 命中触发语。
- 2026-07-05 收尾复核：上述 CLI 测试、VSCode 编译、VSCode 测试、VSIX 打包和 Skill 触发语检查再次通过。
- macOS tmux（tmux）、Terminal.app / iTerm2、VSCode 真实终端冒烟验证尚需在 Mac 环境补跑。
