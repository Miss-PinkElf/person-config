# 孤立 tmux 会话（Orphaned tmux Session）保护实施计划（Implementation Plan）

> **面向 Agentic Worker：** 必须逐项执行并更新复选框；本计划在当前会话内以内联实施（Inline Execution）方式执行，不派发子代理（Subagent）。

**目标：** 清理 5 个已确认的历史孤立 tmux（tmux）会话，并阻止 Worker CLI（Worker CLI）误复用没有 CLI 会话元数据的 tmux 会话。

**架构：** 保持 tmux Driver（tmux Driver）职责不变。Session Store（会话存储）读取时验证元数据归属，CLI 编排层在发现 tmux 会话时将缺失元数据转为可操作错误；`ensure-in-vscode` 和 `open-in-vscode` 共用该校验。元数据缺失或归属错配时显式失败，不自动终止或重建会话。

**技术栈：** Node.js ESM、node:assert/strict、node:fs/promises、tmux、VSCode Attach Bridge（VSCode 附加桥接）。

---

## 文件结构

- 修改：`.codex/skills/devflow-cli-worker/cli/src/cli.mjs`
  - 编排 tmux 会话存在性与 CLI 元数据校验，向调用者提供可操作的孤立会话错误。
- 修改：`.codex/skills/devflow-cli-worker/cli/src/session-store.mjs`
  - 在读取元数据时验证其归属并丢弃 JSON 中未定义的覆盖字段，保护所有控制命令。
- 修改：`.codex/skills/devflow-cli-worker/cli/src/cli.test.mjs`
  - 覆盖 `ensure-in-vscode` 和 `open-in-vscode` 的孤立会话拒绝行为，保护既有正常复用行为。
- 修改：`.codex/skills/devflow-cli-worker/cli/README.md`
  - 说明孤立会话检测与人工清理方式。
- 修改：`.codex/skills/devflow-cli-worker/SKILL.md`
  - 说明启动失败时的检查与清理规程。
- 修改：`.devflow/devflow-cli-worker/spec/{proposal,design,tasks}.md`
  - 为当前重型路径（Heavy Path）补充已批准的行为变更与可追踪任务。

### Task 1：清理确认过的历史测试会话（已完成）

**文件：**
- 修改：无源码文件
- 验证：tmux 会话列表与当前 session 附件目录

- [x] **步骤 1：执行前核对精确会话集合**

运行：

```bash
tmux list-sessions -F '#{session_name}' | rg '^devflow-worker-(atomic-clear-test|macos-worker|mouse-smoke|speed-terminal-test|vscode-terminal-test)$'
test -f .devflow/devflow-cli-worker/sessions/clear-task-test-20260710/cli-session.json
```

预期：输出正好 5 个历史会话名，且当前 `clear-task-test-20260710` 的元数据存在。

- [x] **步骤 2：只结束已确认的 5 个孤立会话**

运行：

```bash
tmux kill-session -t devflow-worker-atomic-clear-test
tmux kill-session -t devflow-worker-macos-worker
tmux kill-session -t devflow-worker-mouse-smoke
tmux kill-session -t devflow-worker-speed-terminal-test
tmux kill-session -t devflow-worker-vscode-terminal-test
```

预期：命令均成功；不执行任何 `clear-task-test-20260710` 相关 kill 命令。

- [x] **步骤 3：验证清理边界**

运行：

```bash
tmux list-sessions -F '#{session_name}' | rg '^devflow-worker-'
```

预期：仅保留 `devflow-worker-clear-task-test-20260710`。

### Task 2：先定义孤立会话的失败行为（已完成）

**文件：**
- 修改：`.codex/skills/devflow-cli-worker/cli/src/cli.test.mjs`
- 测试：`.codex/skills/devflow-cli-worker/cli/src/cli.test.mjs`

- [x] **步骤 1：添加 `ensure-in-vscode` 的失败测试**

在 `existingTmuxSession = true` 且不创建 `orphaned` 元数据的条件下，加入：

```js
const mouseCallCount = tmuxCalls.filter((call) => call === "setMouse").length;
await rejects(
  runCli(["ensure-in-vscode", "--id", "orphaned", "--command", "codex"], {
    cwd: root,
    stdout: { write: (text) => output.push(text) },
    stderr: { write: (text) => output.push(text) },
    tmux: fakeTmux,
    terminal: fakeTerminal
  }),
  /worker orphaned 的 tmux 会话存在，但 CLI 会话元数据不存在/
);
equal(tmuxCalls.filter((call) => call === "setMouse").length, mouseCallCount);
```

- [x] **步骤 2：添加 `open-in-vscode` 的失败测试**

紧接着加入：

```js
const bridgeCallCount = bridgeCalls.length;
await rejects(
  runCli(["open-in-vscode", "--id", "orphaned"], {
    cwd: root,
    stdout: { write: (text) => output.push(text) },
    stderr: { write: (text) => output.push(text) },
    tmux: fakeTmux,
    terminal: fakeTerminal,
    bridge: fakeBridge
  }),
  /worker orphaned 的 tmux 会话存在，但 CLI 会话元数据不存在/
);
equal(bridgeCalls.length, bridgeCallCount);
```

- [x] **步骤 3：补充有效 JSON 但字段错配的失败测试**

为 `mismatched` 创建可解析、但 `workerId` 与 `tmuxSessionName` 指向其它 worker 的 cli-session.json；分别断言 `ensure-in-vscode` 不设置鼠标、`open-in-vscode` 不请求桥接，并返回“元数据与当前 tmux 会话不匹配”。

- [x] **步骤 4：运行测试并确认当前实现失败**

运行：

```bash
node .codex/skills/devflow-cli-worker/cli/src/cli.test.mjs
```

预期：失败；当前实现会输出 `worker orphaned reused`，并设置鼠标或继续请求 attach，而不是抛出目标错误。

### Task 3：实现最小的元数据保护（已完成）

**文件：**
- 修改：`.codex/skills/devflow-cli-worker/cli/src/cli.mjs`
- 测试：`.codex/skills/devflow-cli-worker/cli/src/cli.test.mjs`

- [x] **步骤 1：校验元数据归属字段**

Session Store（会话存储）的 `readSession` 必须比较 `workerId`、`tmuxSessionName`、`relativeSessionPath` 和 `relativeResultPath` 与按 id 推导的预期值；任何不匹配都拒绝继续，并且只合并允许的元数据字段。

- [x] **步骤 2：加入共享元数据校验函数**

在 `ensureInVscode` 前加入：

```js
async function requireSessionMetadata(id, sessionName, context) {
  try {
    await context.store.readSession(id);
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error(
        `worker ${id} 的 tmux 会话存在，但 CLI 会话元数据不存在。请先运行 tmux kill-session -t ${sessionName} 清理孤立会话后重试。`
      );
    }
    throw error;
  }
}
```

- [x] **步骤 3：在两个复用入口调用共享校验**

将 `ensureInVscode` 的复用分支改为：

```js
if (await context.tmux.hasSession({ sessionName })) {
  await requireSessionMetadata(id, sessionName, context);
  await context.tmux.setMouse({ sessionName });
  context.stdout.write(`worker ${id} reused\n`);
  return;
}
```

在 `openInVscode` 的 `hasSession` 检查之后、`requestAttach` 之前加入：

```js
await requireSessionMetadata(id, sessionName, context);
```

- [x] **步骤 4：运行针对性测试并确认通过**

运行：

```bash
node .codex/skills/devflow-cli-worker/cli/src/cli.test.mjs
```

预期：输出 `cli tests passed`。

### Task 4：更新使用文档与完整验证（已完成）

**文件：**
- 修改：`.codex/skills/devflow-cli-worker/cli/README.md`
- 修改：`.codex/skills/devflow-cli-worker/SKILL.md`
- 测试：Worker CLI 完整测试与真实 tmux 冒烟验证

- [x] **步骤 1：记录孤立会话处理规程**

在 README 的 Session 文件说明后和 Skill 的“启动流程”后补充：如果同名 tmux 会话存在但 `cli-session.json` 缺失或归属字段错配，CLI 会拒绝复用；确认会话无用后，运行：

```bash
tmux kill-session -t devflow-worker-<worker-id>
```

再重试 `ensure-in-vscode` 或 `open-in-vscode`。不得自动终止会话或补造元数据。

- [x] **步骤 2：运行完整自动化验证**

运行：

```bash
npm --prefix .codex/skills/devflow-cli-worker/cli test
git diff --check
```

预期：6 组 CLI 测试全部通过，且 diff 检查无输出。

- [x] **步骤 3：执行真实 tmux 回归验证**

运行：

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs ensure-in-vscode --id macos-worker --command codex
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs get-info macos-worker --tail 5
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs ensure-in-vscode --id macos-worker --command codex
```

预期：首次创建 `macos-worker` 的元数据与 tmux 会话；`get-info` 成功返回 JSON；第二次输出 `worker macos-worker reused`。本轮保留该新会话，不向其发送任务。

## 提交约束

- [x] 用户已明确授权，已创建本轮提交（修复孤立tmux会话误复用）。提交范围仅限 Worker Skill（Worker Skill）、CLI（CLI）与 `.devflow/devflow-cli-worker/` 文档；排除 session 附件、`.vscode/controlled-explorer.json`、config.ts、.gitignore 和 tsconfig.json。
