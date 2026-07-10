# VSCode 内置终端冒烟测试实施计划

> **执行说明：** 在当前会话中按任务顺序执行；测试失败时停止猜测，保留证据并转入 bug 路径（Bug Path）。

**目标：** 验证现有 VSCode 插件能创建并 attach 可见 Codex CLI worker，且 Worker CLI 可完成清空对话、发送提示词、轮询和结果回收。

**架构：** VSCode 插件负责创建内置终端并执行 `start-in-vscode`，该命令创建并 attach 到 `tmux` 会话。主 Agent 通过现有 Worker CLI 操作该会话，测试结论写入 mission，而会话附件仅作证据。

**技术栈：** VSCode Extension、Node.js、tmux、Codex CLI、devflow Worker CLI。

---

### Task 1：验证测试前置条件

**文件：**
- 读取：`vscode-extensions/devflow-cli-worker/package.json`
- 读取：`.codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs`
- 读取：`.devflow/devflow-cli-worker/sessions/vscode-smoke/cli-session.json`（测试产生后）

- [ ] **Step 1：确认 VSCode 正在运行且本机安装目标插件**

运行：

```bash
ps aux | rg "[V]isual Studio Code"
code --list-extensions --show-versions | rg "^local\\.devflow-cli-worker@"
```

预期：VSCode 进程存在，且输出 `local.devflow-cli-worker@0.1.0`。

- [ ] **Step 2：确认 CLI 与 tmux 可用，且不存在同名测试会话**

运行：

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs --help
tmux has-session -t devflow-worker-vscode-smoke 2>/dev/null
```

预期：CLI help 正常输出；`tmux has-session` 返回非零表示可以使用新会话名。

### Task 2：通过 VSCode 插件创建可见 worker

**文件：**
- 读取：`vscode-extensions/devflow-cli-worker/src/extension.ts`
- 生成：`.devflow/devflow-cli-worker/sessions/vscode-smoke/cli-session.json`
- 生成：`.devflow/devflow-cli-worker/sessions/vscode-smoke/prompt.md`

- [ ] **Step 1：执行命令面板命令并使用固定 worker id**

在当前工作区的 VSCode 中执行 `Start devflow CLI Worker`，在输入框中填写 `vscode-smoke`。

预期：出现新的 `devflow worker: vscode-smoke` 内置终端，执行命令：

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs start-in-vscode --id vscode-smoke --command codex && tmux attach -t devflow-worker-vscode-smoke
```

- [ ] **Step 2：确认 worker 已创建并终端 attach**

运行：

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs get-info vscode-smoke --tail 20
```

预期：会话信息包含 `vscode-smoke` 与 `devflow-worker-vscode-smoke`；VSCode 终端显示 Codex CLI。

### Task 3：验证对话与提示词控制

**文件：**
- 生成：`.devflow/devflow-cli-worker/sessions/vscode-smoke/screen.txt`
- 生成：`.devflow/devflow-cli-worker/sessions/vscode-smoke/transcript.log`
- 生成：`.devflow/devflow-cli-worker/sessions/vscode-smoke/result.md`

- [ ] **Step 1：清空 Codex CLI 对话**

运行：

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs send vscode-smoke "/clear"
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs key vscode-smoke Enter
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs get-info vscode-smoke --tail 10
```

预期：VSCode 终端中的 Codex CLI 回到新对话状态；`get-info` 包含最新屏幕内容。

- [ ] **Step 2：发送原始测试提示词并提交**

原始提示词：`请只把“vscode worker smoke ok”写入 .devflow/devflow-cli-worker/sessions/vscode-smoke/result.md，然后停止。`

运行：

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs send vscode-smoke "请只把‘vscode worker smoke ok’写入 .devflow/devflow-cli-worker/sessions/vscode-smoke/result.md，然后停止。"
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs key vscode-smoke Enter
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs wait-agent vscode-smoke --timeout 1200 --poll 15 --stale 30
```

预期：worker 接收提示词；如 TUI 未提交，则再发送一次 `key vscode-smoke Enter`；`result.md` 出现指定文本。

- [ ] **Step 3：读取结论并验证附件**

运行：

```bash
sed -n '1,80p' .devflow/devflow-cli-worker/sessions/vscode-smoke/result.md
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs get-info vscode-smoke --tail 20
```

预期：`result.md` 精确包含 `vscode worker smoke ok`，且屏幕信息可回显 worker 状态。

### Task 4：清理与回写验证证据

**文件：**
- 修改：`.devflow/devflow-cli-worker/spec/tasks.md`
- 修改：`.devflow/devflow-cli-worker/state.md`
- 修改：`.devflow/devflow-cli-worker/checkpoints.md`

- [ ] **Step 1：停止临时 worker**

运行：

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs kill vscode-smoke
tmux has-session -t devflow-worker-vscode-smoke 2>/dev/null
```

预期：`kill` 成功；`tmux has-session` 返回非零。

- [ ] **Step 2：回写结论或失败证据**

记录 VSCode 插件 UI（User Interface）触发结果、`/clear`、提示词提交、`result.md` 内容与清理状态。若失败，写明问题现象、问题原因（仅限已证实原因）与解决方案或阻塞下一步。

- [ ] **Step 3：执行最终验证**

运行：

```bash
git diff --check
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs --help
```

预期：无空白错误，CLI help 成功输出。
