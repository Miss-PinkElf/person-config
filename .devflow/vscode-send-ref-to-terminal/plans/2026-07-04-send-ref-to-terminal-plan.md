# vscode-send-ref-to-terminal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建 VS Code 插件（VS Code Extension）`vscode-send-ref-to-terminal`，把当前编辑器选中的代码行引用发送到当前活动终端（Active Terminal）输入区且不自动执行。

**Architecture:** 插件采用极简独立结构，命令入口（Command Entry）位于 `src/extension.ts`。核心逻辑拆成可测试的纯函数（Pure Functions），负责生成行号范围（Line Range）与规范化引用路径（Normalized Reference Path）；VS Code API 调用只留在命令处理层。

**Tech Stack:** TypeScript、VS Code Extension API、Node.js、`@types/vscode`、`@vscode/vsce`、`tsc`。

---

## 文件结构

- 创建：`vscode-extensions/vscode-send-ref-to-terminal/package.json`
  - 负责扩展元数据（Extension Metadata）、命令注册（Command Contribution）、默认快捷键（Default Keybinding）和 npm 脚本。
- 创建：`vscode-extensions/vscode-send-ref-to-terminal/tsconfig.json`
  - 负责 TypeScript 编译配置（TypeScript Compiler Configuration）。
- 创建：`vscode-extensions/vscode-send-ref-to-terminal/src/reference.ts`
  - 负责纯函数：行号引用生成、路径斜杠规范化。
- 创建：`vscode-extensions/vscode-send-ref-to-terminal/src/extension.ts`
  - 负责 VS Code 命令注册、编辑器/终端获取、提示与发送。
- 创建：`vscode-extensions/vscode-send-ref-to-terminal/src/reference.test.ts`
  - 负责核心纯函数测试（Pure Function Tests）。
- 创建：`vscode-extensions/vscode-send-ref-to-terminal/.vscodeignore`
  - 负责打包排除规则，确保 `out/` 编译产物不被排除。
- 创建：`vscode-extensions/vscode-send-ref-to-terminal/README.md`
  - 负责使用说明、默认快捷键、限制与验证方式。

## Task 1：创建项目骨架与脚本

**Files:**

- Create: `vscode-extensions/vscode-send-ref-to-terminal/package.json`
- Create: `vscode-extensions/vscode-send-ref-to-terminal/tsconfig.json`
- Create: `vscode-extensions/vscode-send-ref-to-terminal/.vscodeignore`

- [ ] **Step 1: 创建 package.json**

写入扩展元数据、命令、快捷键和脚本：

```json
{
  "name": "vscode-send-ref-to-terminal",
  "displayName": "Send Ref to Terminal",
  "description": "Send the selected file line reference to the active terminal without executing it.",
  "version": "0.1.0",
  "publisher": "local",
  "engines": {
    "vscode": "^1.90.0"
  },
  "categories": [
    "Other"
  ],
  "activationEvents": [
    "onCommand:sendRefToTerminal.send"
  ],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "sendRefToTerminal.send",
        "title": "Send File Reference to Terminal"
      }
    ],
    "keybindings": [
      {
        "command": "sendRefToTerminal.send",
        "key": "cmd+shift+l",
        "mac": "cmd+shift+l",
        "when": "editorTextFocus"
      },
      {
        "command": "sendRefToTerminal.send",
        "key": "ctrl+shift+l",
        "win": "ctrl+shift+l",
        "linux": "ctrl+shift+l",
        "when": "editorTextFocus"
      }
    ]
  },
  "scripts": {
    "compile": "tsc -p ./",
    "test": "node out/reference.test.js",
    "package": "vsce package --no-dependencies"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/vscode": "^1.90.0",
    "@vscode/vsce": "^3.1.0",
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 2: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2022",
    "outDir": "out",
    "lib": [
      "ES2022"
    ],
    "sourceMap": true,
    "rootDir": "src",
    "strict": true
  },
  "include": [
    "src"
  ]
}
```

- [ ] **Step 3: 创建 .vscodeignore**

```text
.vscode/**
src/**
node_modules/**
*.map
tsconfig.json
package-lock.json
```

- [ ] **Step 4: 安装依赖**

Run: `npm install`

Expected: 生成 `package-lock.json`，安装 TypeScript、VS Code 类型定义（Type Definitions）和打包工具（Packaging Tool）。

## Task 2：实现引用生成纯函数与测试

**Files:**

- Create: `vscode-extensions/vscode-send-ref-to-terminal/src/reference.ts`
- Create: `vscode-extensions/vscode-send-ref-to-terminal/src/reference.test.ts`

- [ ] **Step 1: 写纯函数测试**

```typescript
import assert from "node:assert/strict";
import { buildLineReference, normalizeReferencePath } from "./reference";

assert.equal(normalizeReferencePath("src\\example.ts"), "src/example.ts");
assert.equal(normalizeReferencePath("src/example.ts"), "src/example.ts");

assert.equal(
  buildLineReference({ relativePath: "src/example.ts", startLine: 12, endLine: 12 }),
  "@src/example.ts#L12 "
);

assert.equal(
  buildLineReference({ relativePath: "src\\example.ts", startLine: 12, endLine: 20 }),
  "@src/example.ts#L12-20 "
);

console.log("reference tests passed");
```

- [ ] **Step 2: 实现纯函数**

```typescript
export interface LineReferenceInput {
  relativePath: string;
  startLine: number;
  endLine: number;
}

export function normalizeReferencePath(relativePath: string): string {
  return relativePath.replace(/\\/g, "/");
}

export function buildLineReference(input: LineReferenceInput): string {
  const normalizedPath = normalizeReferencePath(input.relativePath);
  const linePart =
    input.startLine === input.endLine
      ? `L${input.startLine}`
      : `L${input.startLine}-${input.endLine}`;

  return `@${normalizedPath}#${linePart} `;
}
```

- [ ] **Step 3: 编译并运行测试**

Run: `npm run compile`

Expected: TypeScript 编译通过，生成 `out/`。

Run: `npm test`

Expected: 输出 `reference tests passed`。

## Task 3：实现 VS Code 命令入口

**Files:**

- Create: `vscode-extensions/vscode-send-ref-to-terminal/src/extension.ts`

- [ ] **Step 1: 实现命令注册与发送逻辑**

```typescript
import * as vscode from "vscode";
import { buildLineReference } from "./reference";

const SEND_COMMAND = "sendRefToTerminal.send";

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(SEND_COMMAND, sendReferenceToTerminal);
  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  // VS Code 扩展生命周期（Extension Lifecycle）要求保留该出口。
}

async function sendReferenceToTerminal(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("请先打开一个文件再发送代码引用。");
    return;
  }

  const terminal = vscode.window.activeTerminal;
  if (!terminal) {
    vscode.window.showWarningMessage("请先打开或选中一个终端再发送代码引用。");
    return;
  }

  const relativePath = vscode.workspace.asRelativePath(editor.document.uri, false);
  const selection = editor.selection;
  const reference = buildLineReference({
    relativePath,
    startLine: selection.start.line + 1,
    endLine: selection.end.line + 1
  });

  terminal.sendText(reference, false);
}
```

- [ ] **Step 2: 编译验证**

Run: `npm run compile`

Expected: TypeScript 编译通过。

## Task 4：补充 README 与打包配置验证

**Files:**

- Create: `vscode-extensions/vscode-send-ref-to-terminal/README.md`

- [ ] **Step 1: 写 README**

README 内容覆盖：

```markdown
# Send Ref to Terminal

一个极简 VS Code 插件（VS Code Extension），用于把当前选中的代码行引用发送到当前活动终端（Active Terminal）输入区，并且不自动执行。

## 使用方式

1. 在编辑器中打开文件。
2. 选中一行或多行代码。
3. 确认目标终端是当前活动终端。
4. 按默认快捷键：
   - macOS：`Cmd+Shift+L`
   - Windows/Linux：`Ctrl+Shift+L`

终端输入区会出现类似内容：

```text
@src/example.ts#L12-20 
```

## 限制

- 不自动识别 Claude Code 终端。
- 不自动执行终端输入。
- 不支持多选区。
- 不实现终端自动重命名（Terminal Rename）。

## 命令

- `Send File Reference to Terminal`
- 命令 ID（Command ID）：`sendRefToTerminal.send`

## 开发验证

```bash
npm install
npm run compile
npm test
npm run package
```
```

- [ ] **Step 2: 打包验证**

Run: `npm run package`

Expected: 生成 `vscode-send-ref-to-terminal-0.1.0.vsix`。

## Task 5：最终验证与状态收口

**Files:**

- Modify: `.devflow/vscode-send-ref-to-terminal/spec/tasks.md`
- Modify: `.devflow/vscode-send-ref-to-terminal/state.md`
- Modify: `.devflow/vscode-send-ref-to-terminal/checkpoints.md`

- [ ] **Step 1: 执行验证命令**

Run: `npm run compile`

Expected: 编译通过。

Run: `npm test`

Expected: 输出 `reference tests passed`。

Run: `npm run package`

Expected: 生成 `.vsix` 安装包。

- [ ] **Step 2: 更新任务状态**

把 `spec/tasks.md` 中已完成任务标记为完成，并记录验证证据。

- [ ] **Step 3: 写 checkpoint**

在 `checkpoints.md` 记录当前阶段已完成插件源码、编译、测试与打包验证。

## 自检

- 对齐文档（Align Note）中的核心需求均已覆盖到任务。
- 第一版非目标未进入实施计划。
- 计划没有依赖尚未定义的函数或接口。
- 计划保留文档更新与打包验证。
