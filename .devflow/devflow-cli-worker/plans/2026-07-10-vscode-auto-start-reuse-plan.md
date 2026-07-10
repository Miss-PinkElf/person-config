# VSCode 自动启动与会话复用实施计划

> **执行说明：** 在当前会话中顺序实施。每项先更新或补充测试，再做最小实现；出现失败时保留证据并进入 bug 路径（Bug Path）。

**目标：** VSCode 插件在工作区打开后自动创建默认 worker 终端，并对已有 `macos-worker` tmux 会话复用而非重启 Codex CLI。

**架构：** Worker CLI（Worker CLI）新增显式的 `ensure-in-vscode` 命令，由 tmux Driver（tmux Driver）提供 session 存在性判断。VSCode 插件在 `onStartupFinished` 后调用该命令并 attach；命令面板入口继续使用既有 `start-in-vscode` 以保留多 worker 行为。

**技术栈：** Node.js ESM、VSCode Extension API、TypeScript、tmux、Codex CLI。

---

### Task 1：同步 OpenSpec 任务定义

**文件：**
- 修改：`.devflow/devflow-cli-worker/spec/proposal.md`
- 修改：`.devflow/devflow-cli-worker/spec/design.md`
- 修改：`.devflow/devflow-cli-worker/spec/tasks.md`

- [ ] **Step 1：补充自动启动与复用范围**

在 proposal 中增加 macOS VSCode 插件自动启动、默认 `macos-worker`、已有 tmux 会话 attach 复用和保留手动多 worker 入口；在非目标中排除 worker 管理 UI（User Interface）。

- [ ] **Step 2：补充实现协议**

在 design 中定义：

```text
ensure-in-vscode --id macos-worker --command codex
  tmux session 存在 -> worker macos-worker reused
  tmux session 不存在 -> 复用 start(..., "vscode") -> worker macos-worker started
```

并记录插件 `onStartupFinished` 自动启动与手动命令语义分离。

- [ ] **Step 3：新增可验收任务**

在 tasks 中新增自动启动与会话复用任务、CLI/插件测试命令和真实 VSCode 复验标准。

### Task 2：实现 CLI 会话复用

**文件：**
- 修改：`.codex/skills/devflow-cli-worker/cli/src/tmux-driver.mjs`
- 修改：`.codex/skills/devflow-cli-worker/cli/src/tmux-driver.test.mjs`
- 修改：`.codex/skills/devflow-cli-worker/cli/src/cli.mjs`
- 修改：`.codex/skills/devflow-cli-worker/cli/src/cli.test.mjs`

- [ ] **Step 1：为 tmux Driver 编写存在性测试**

扩展 fake `execFile`，断言 `hasSession({ sessionName: "devflow-worker-alpha" })` 调用：

```js
["tmux", ["has-session", "-t", "devflow-worker-alpha"]]
```

并覆盖 exit code 为 `1` 时返回 `false` 的分支，非 `1` 错误继续抛出。

- [ ] **Step 2：实现 `hasSession`**

在 tmux Driver 中调用 `tmux has-session -t <sessionName>`：成功返回 `true`；`error.code === 1` 返回 `false`；`ENOENT` 与其它错误沿用中文错误包装。

- [ ] **Step 3：为 CLI 复用和首次启动写测试**

在 `cli.test.mjs` 的 fake tmux 中记录调用，执行两次：

```js
await runCli(["ensure-in-vscode", "--id", "reused", "--command", "codex"], options);
```

首次返回 `hasSession: false`，断言调用 `newSession` 并输出 `worker reused started`；第二次返回 `hasSession: true`，断言不调用 `newSession`，不改写已有 `result.md`，并输出 `worker reused reused`。

- [ ] **Step 4：实现 `ensure-in-vscode`**

在 `runCli` 分派：

```js
if (command === "ensure-in-vscode") return ensureInVscode(rest, context);
```

实现使用 `--id`、`--command` 的默认值；先调用 `context.tmux.hasSession`。存在时只输出 `worker <id> reused`；不存在时调用既有 `start(args, context, "vscode")`。更新 usage 文本列出新命令。

- [ ] **Step 5：运行 CLI 测试**

运行：

```bash
npm --prefix .codex/skills/devflow-cli-worker/cli test
```

预期：所有 session store、tmux driver、macOS terminal、wait-agent 和 CLI 测试通过。

### Task 3：实现 VSCode 自动启动

**文件：**
- 修改：`vscode-extensions/devflow-cli-worker/package.json`
- 修改：`vscode-extensions/devflow-cli-worker/src/commandBuilder.ts`
- 修改：`vscode-extensions/devflow-cli-worker/src/commandBuilder.test.ts`
- 修改：`vscode-extensions/devflow-cli-worker/src/extension.ts`

- [ ] **Step 1：为自动启动命令构造增加测试**

新增 `buildEnsureWorkerCommand` 测试，断言输出依次包含：

```text
cd '<workspace>'
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs ensure-in-vscode --id macos-worker --command codex
tmux attach -t devflow-worker-macos-worker
```

- [ ] **Step 2：实现自动启动命令构造**

在 `commandBuilder.ts` 添加 `buildEnsureWorkerCommand`，沿用 `quoteForShell`，只替换 CLI 子命令为 `ensure-in-vscode`。

- [ ] **Step 3：配置启动激活**

在 `package.json` 的 `activationEvents` 同时保留：

```json
["onStartupFinished", "onCommand:devflowCliWorker.start"]
```

- [ ] **Step 4：实现自动终端创建并保留手动入口**

在 `activate` 中注册手动命令后调用 `startDefaultWorker()`；该函数在有 workspace 时以固定 `macos-worker` 创建并显示终端，发送 `buildEnsureWorkerCommand` 结果。现有 `startWorker()` 继续显示输入框并使用 `buildStartWorkerCommand`。

- [ ] **Step 5：编译并运行插件测试**

运行：

```bash
npm --prefix vscode-extensions/devflow-cli-worker run compile
npm --prefix vscode-extensions/devflow-cli-worker test
```

预期：TypeScript（TypeScript）编译和命令构造测试通过。

### Task 4：更新文档并执行真实 VSCode 验证

**文件：**
- 修改：`.codex/skills/devflow-cli-worker/SKILL.md`
- 修改：`.codex/skills/devflow-cli-worker/cli/README.md`
- 修改：`vscode-extensions/devflow-cli-worker/README.md`
- 修改：`.devflow/devflow-cli-worker/state.md`
- 修改：`.devflow/devflow-cli-worker/checkpoints.md`

- [ ] **Step 1：更新使用说明**

说明 VSCode 打开工作区后默认自动启动 `macos-worker`；已有 session 时 attach 复用；`Start devflow CLI Worker` 仍用于附加 worker；Skill（Skill）中补充 `ensure-in-vscode` 命令。

- [ ] **Step 2：打包并安装待验证 VSIX**

运行：

```bash
npm --prefix vscode-extensions/devflow-cli-worker run package
```

预期：生成 `vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.1.vsix`；记录既有 `repository` 和 LICENSE 警告但不顺手修改。

- [ ] **Step 3：真实自动启动冒烟测试**

重新加载当前 VSCode 工作区。确认无需命令面板操作即出现 `devflow worker: macos-worker` 终端并 attach。运行：

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs get-info macos-worker --tail 20
```

关闭并重新打开 VSCode 工作区后，确认 tmux 中只有一个 `devflow-worker-macos-worker`，且终端重新 attach。

- [ ] **Step 4：回写验证证据**

更新 `state.md`、`checkpoints.md` 和 `spec/tasks.md`，记录实际触发结果、测试命令输出、风险与遗留项。

- [ ] **Step 5：最终验证**

运行：

```bash
git diff --check
npm --prefix .codex/skills/devflow-cli-worker/cli test
npm --prefix vscode-extensions/devflow-cli-worker run compile
npm --prefix vscode-extensions/devflow-cli-worker test
```

预期：无空白错误，CLI 测试、插件编译和插件测试均通过。
