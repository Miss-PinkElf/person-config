# Skill Bundled CLI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use inline execution for this small structure migration. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 devflow CLI Worker（devflow CLI Worker）的 CLI（Command Line Interface）移入技能目录（Skill Directory），让 `.codex/skills/devflow-cli-worker/` 成为完整能力包主目录。

**Architecture:** `.codex/skills/devflow-cli-worker/` 保持 Codex 技能（Codex Skill）发现入口，新增 `cli/` 子目录承载原 `tools/devflow-cli-worker/` 的 Node.js CLI（Node.js CLI）。VSCode 插件（VSCode Extension）继续独立放在 `vscode-extensions/devflow-cli-worker/`，但默认 CLI 相对路径改为 `.codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs`。

**Tech Stack:** Node.js ESM（Node.js ESM）、tmux（tmux）、VSCode Extension API（VSCode Extension API）、npm scripts（npm scripts）。

---

## Scope

本计划只做目录归并和引用更新，不改变 CLI 行为、不新增 UI（User Interface）、不处理 Windows / WSL 入口、不补 repository / LICENSE。

## File Structure

- Move: `tools/devflow-cli-worker/` -> `.codex/skills/devflow-cli-worker/cli/`
- Modify: `.codex/skills/devflow-cli-worker/SKILL.md`
- Modify: `.codex/skills/devflow-cli-worker/cli/README.md`
- Modify: `vscode-extensions/devflow-cli-worker/src/extension.ts`
- Modify: `vscode-extensions/devflow-cli-worker/src/commandBuilder.test.ts`
- Modify as needed: `vscode-extensions/devflow-cli-worker/README.md`
- Modify as needed: `.devflow/devflow-cli-worker/state.md`
- Modify as needed: `.devflow/devflow-cli-worker/checkpoints.md`

## Tasks

### Task 1: Move CLI into Skill package

**Files:**
- Move: `tools/devflow-cli-worker/` -> `.codex/skills/devflow-cli-worker/cli/`

- [x] **Step 1: Create the target CLI directory by moving the existing tree**

Run:

```bash
mv tools/devflow-cli-worker .codex/skills/devflow-cli-worker/cli
```

Expected:

```text
.codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs
.codex/skills/devflow-cli-worker/cli/package.json
.codex/skills/devflow-cli-worker/cli/src/cli.mjs
```

- [x] **Step 2: Confirm old CLI directory is gone and target CLI exists**

Run:

```bash
test ! -e tools/devflow-cli-worker
test -f .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs
```

Expected: both commands exit with code `0`.

### Task 2: Update runtime and documentation paths

**Files:**
- Modify: `.codex/skills/devflow-cli-worker/SKILL.md`
- Modify: `.codex/skills/devflow-cli-worker/cli/README.md`
- Modify: `vscode-extensions/devflow-cli-worker/src/extension.ts`
- Modify: `vscode-extensions/devflow-cli-worker/src/commandBuilder.test.ts`
- Modify: `vscode-extensions/devflow-cli-worker/README.md`

- [x] **Step 1: Replace CLI command path references**

Replace:

```text
tools/devflow-cli-worker/bin/devflow-worker.mjs
```

With:

```text
.codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs
```

Expected affected active files:

```text
.codex/skills/devflow-cli-worker/SKILL.md
.codex/skills/devflow-cli-worker/cli/README.md
vscode-extensions/devflow-cli-worker/src/extension.ts
vscode-extensions/devflow-cli-worker/src/commandBuilder.test.ts
vscode-extensions/devflow-cli-worker/README.md
```

- [x] **Step 2: Keep historical devflow records stable unless they describe current state**

Do not rewrite old plan/spec historical content. Only update current-state records if needed:

```text
.devflow/devflow-cli-worker/state.md
.devflow/devflow-cli-worker/checkpoints.md
```

### Task 3: Verify CLI and VSCode extension after move

**Files:**
- Test: `.codex/skills/devflow-cli-worker/cli/src/*.test.mjs`
- Test: `vscode-extensions/devflow-cli-worker/src/commandBuilder.test.ts`

- [x] **Step 1: Run CLI unit tests from the new path**

Run:

```bash
npm --prefix .codex/skills/devflow-cli-worker/cli test
```

Expected: all CLI tests pass.

- [x] **Step 2: Run VSCode extension compile**

Run:

```bash
npm --prefix vscode-extensions/devflow-cli-worker run compile
```

Expected: TypeScript compile succeeds.

- [x] **Step 3: Run VSCode extension tests**

Run:

```bash
npm --prefix vscode-extensions/devflow-cli-worker test
```

Expected: extension tests pass and assert the new CLI path.

- [x] **Step 4: Run a lightweight CLI help check**

Run:

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs --help
```

Expected: command prints usage text and exits successfully.

- [x] **Step 5: Repackage VSIX after extension path update**

Run:

```bash
npm --prefix vscode-extensions/devflow-cli-worker run package
```

Expected: VSIX（VSCode Extension Package）is regenerated with the updated CLI（Command Line Interface）path. Existing non-blocking warnings about missing `repository` and LICENSE may remain.

### Task 4: Record current outcome

**Files:**
- Modify: `.devflow/devflow-cli-worker/state.md`
- Modify: `.devflow/devflow-cli-worker/checkpoints.md`

- [x] **Step 1: Update current state**

Record that the CLI（Command Line Interface）now lives under the Skill（Skill） package:

```text
.codex/skills/devflow-cli-worker/cli/
```

- [x] **Step 2: Add checkpoint**

Add a checkpoint describing:

```text
问题现象：CLI 与 Skill 分散在不同目录，使用和维护时不够直观。
问题原因：第一版按工具目录和技能目录分开落盘，路径引用散落在 Skill、README 和 VSCode 插件中。
解决方案：将 CLI 移入 .codex/skills/devflow-cli-worker/cli/，并更新活动入口与验证命令。
```

- [x] **Step 3: Ask before commit**

完成修改和验证后，询问用户是否需要提交代码；没有明确允许，不执行 `git commit`。

## Self-Review

- Spec coverage: 覆盖用户选择的方案 1，即 Skill（Skill）主包内包含 CLI（Command Line Interface）。
- Placeholder scan: 未使用 TBD、TODO 或未定义后续步骤。
- Type consistency: VSCode 插件（VSCode Extension）的 `cliRelativePath` 与 README / Skill 命令路径保持一致。
