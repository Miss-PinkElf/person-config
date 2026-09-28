# 快捷打开指定文件实施计划（Implementation Plan）

> **给执行代理：** 按任务顺序实施，用 `- [x]` 跟踪。用户已授权计划落盘后直接进入规格（Spec）与实施（Apply）。本仓库规则要求提交前询问用户，Apply 阶段不执行 `git commit`。

**目标（Goal）：** 做一个独立的 VS Code 插件（VS Code Extension）`vscode-quick-open-target`。用户在 `keybindings.json` 里为命令 `quickOpenTarget.openFile` 配置任意多条快捷键，每条打开不同文件，并把光标放到真正的文件末尾或最后一个非空白字符之后。

**架构（Architecture）：** 参数解析和光标计算都是不依赖 VS Code 的纯函数，用 Node 断言测试锁住规则。扩展入口只负责读取工作区、检查目标是已存在的文件、打开编辑器并设置单一选区。插件不贡献默认快捷键。

**技术栈（Tech Stack）：** TypeScript、VS Code Extension API `^1.90.0`、Node.js `assert/strict`、`tsc`、`vsce`。参考同仓库 `vscode-extensions/vscode-send-ref-to-terminal/` 的工程骨架，不复用它的业务代码。

---

## 已确认约束

- 只打开文件，不定位文件夹。
- 配置只写在 `keybindings.json` 的 `args` 里：必填 `path`，可选 `cursor`、`workspaceFolder`。
- 绝对路径直接打开。相对路径在单根工作区相对该根目录解析。多根工作区的相对路径必须给出唯一的 `workspaceFolder` 名称。
- `workspaceFolder` 与绝对路径同时出现时视为参数错误。
- 相对路径不能用 `..` 越出工作区根目录。`~`、URI、环境变量和 VS Code 变量都不展开。
- `cursor` 默认 `end`。`lastContent` 停在最后一个非空白字符之后。空文件和全空白文件停在文档起点。
- 文件不存在、目标是目录或无法打开时只报错，不创建文件。
- 不与受控文件浏览器（Controlled Explorer）耦合。

## 文件结构

- 新建：`vscode-extensions/vscode-quick-open-target/package.json`
- 新建：`vscode-extensions/vscode-quick-open-target/tsconfig.json`
- 新建：`vscode-extensions/vscode-quick-open-target/.vscodeignore`
- 新建：`vscode-extensions/vscode-quick-open-target/.gitignore`
- 新建：`vscode-extensions/vscode-quick-open-target/README.md`
- 新建：`vscode-extensions/vscode-quick-open-target/src/cursorPosition.ts`
- 新建：`vscode-extensions/vscode-quick-open-target/src/cursorPosition.test.ts`
- 新建：`vscode-extensions/vscode-quick-open-target/src/openTarget.ts`
- 新建：`vscode-extensions/vscode-quick-open-target/src/openTarget.test.ts`
- 新建：`vscode-extensions/vscode-quick-open-target/src/extension.ts`
- 生成：`vscode-extensions/vscode-quick-open-target/vscode-quick-open-target-0.1.0.vsix`

`cursorPosition.ts` 只计算文本偏移。`openTarget.ts` 只把参数解析成绝对文件路径和光标模式。`extension.ts` 调用这两个单元，并处理文件系统与编辑器。

## 任务 1：插件骨架

**文件：**

- 新建 `vscode-extensions/vscode-quick-open-target/package.json`
- 新建 `vscode-extensions/vscode-quick-open-target/tsconfig.json`
- 新建 `vscode-extensions/vscode-quick-open-target/.vscodeignore`
- 新建 `vscode-extensions/vscode-quick-open-target/.gitignore`

- [x] **步骤 1：写入工程文件**

`package.json` 不声明 `contributes.keybindings`。

```json
{
  "name": "vscode-quick-open-target",
  "displayName": "快捷打开指定文件",
  "description": "通过快捷键打开指定文件，并把光标放到文件末尾或最后一个非空字符之后。",
  "version": "0.1.0",
  "publisher": "local",
  "engines": {
    "vscode": "^1.90.0"
  },
  "categories": ["Other"],
  "activationEvents": ["onCommand:quickOpenTarget.openFile"],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "quickOpenTarget.openFile",
        "title": "快捷打开指定文件"
      }
    ]
  },
  "scripts": {
    "compile": "tsc -p ./",
    "test": "npm run compile && node out/cursorPosition.test.js && node out/openTarget.test.js",
    "package": "npm run compile && vsce package --no-dependencies"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/vscode": "^1.90.0",
    "@vscode/vsce": "^3.1.0",
    "typescript": "^5.5.0"
  }
}
```

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2022",
    "outDir": "out",
    "lib": ["ES2022"],
    "sourceMap": true,
    "rootDir": "src",
    "strict": true
  },
  "include": ["src"]
}
```

`.vscodeignore` 排除源码和测试产物，保留 `out/` 里的运行文件。`.gitignore` 排除 `node_modules/` 与 `out/`。

- [x] **步骤 2：安装依赖**

在 `vscode-extensions/vscode-quick-open-target/` 执行 `npm install`。期望生成 `package-lock.json` 和 `node_modules/`，退出码为 0。

## 任务 2：光标偏移

**文件：**

- 新建 `vscode-extensions/vscode-quick-open-target/src/cursorPosition.test.ts`
- 新建 `vscode-extensions/vscode-quick-open-target/src/cursorPosition.ts`

- [x] **步骤 1：先写失败测试**

```typescript
import { equal } from "node:assert/strict";
import { resolveCursorOffset } from "./cursorPosition";

equal(resolveCursorOffset("", "end"), 0);
equal(resolveCursorOffset("hello", "end"), 5);
equal(resolveCursorOffset("hello\n", "end"), 6);
equal(resolveCursorOffset("hello\n\n", "end"), 7);
equal(resolveCursorOffset("hello\r\n", "end"), 7);

equal(resolveCursorOffset("", "lastContent"), 0);
equal(resolveCursorOffset("\n\n  \t", "lastContent"), 0);
equal(resolveCursorOffset("hello", "lastContent"), 5);
equal(resolveCursorOffset("hello\n\n", "lastContent"), 5);
equal(resolveCursorOffset("hello  \n", "lastContent"), 5);
equal(resolveCursorOffset("ab c", "lastContent"), 4);
equal(resolveCursorOffset("ab c\t\r\n", "lastContent"), 4);
equal(resolveCursorOffset("你好\n", "lastContent"), 2);

console.log("cursor position tests passed");
```

- [x] **步骤 2：确认测试先失败**

先放一个返回 `-1` 的桩，运行 `npm test`。期望断言失败，且失败原因是偏移不正确。

- [x] **步骤 3：实现最小逻辑**

`end` 返回 `text.length`。`lastContent` 从末尾跳过 JavaScript 空白字符，返回最后一个非空白字符的下一个偏移；找不到时返回 `0`。

## 任务 3：参数与路径

**文件：**

- 新建 `vscode-extensions/vscode-quick-open-target/src/openTarget.test.ts`
- 新建 `vscode-extensions/vscode-quick-open-target/src/openTarget.ts`

- [x] **步骤 1：先写失败测试**

覆盖这些结果：

- 参数不是对象、缺少 `path`、`path` 为空、未知字段，都返回明确中文错误。
- 单根工作区相对路径解析到该根目录，缺省 `cursor` 为 `end`。
- `cursor: "lastContent"` 被保留；其他值报错。
- 绝对路径不依赖工作区；同时提供 `workspaceFolder` 报错。
- 没有工作区时相对路径报错。
- 多根工作区缺少名称、名称不存在、名称重复都报错；名称匹配时解析到对应根目录。
- 单根工作区给出错误名称时报错，给出正确名称时成功。
- `../outside.md` 报错；`notes/../today.md` 仍留在根目录内。
- `~`、`~/notes.md`、`file:///tmp/a.md`、`${workspaceFolder}/a.md`、`$HOME/a.md`、`%USERPROFILE%/a.md` 都报错。

期望路径用 `node:path` 的 `path.resolve` 计算，避免把操作系统差异写死。

- [x] **步骤 2：确认测试先失败**

桩函数固定返回“尚未实现”。运行 `npm test`，期望 `openTarget` 断言失败。

- [x] **步骤 3：实现解析**

校验顺序固定为：参数形状、未知字段、`path`、`cursor`、`workspaceFolder`、不支持的路径写法、绝对路径、工作区选择、`..` 越界。绝对路径使用 `path.normalize`。相对路径使用 `path.resolve(root, input)`，再用 `path.relative` 判断是否越出根目录。

错误文案与测试中的字符串保持一致：

- `快捷键参数必须是对象，并包含 path。`
- `快捷键参数包含未知字段“file”。只允许 path、cursor、workspaceFolder。`
- `快捷键参数 path 必须是非空字符串。`
- `cursor 只能是 end 或 lastContent。`
- `workspaceFolder 必须是非空字符串。`
- `不支持用 ~ 表示用户主目录，请改成绝对路径。`
- `不支持 URI。请使用本机绝对路径或工作区相对路径。`
- `不支持环境变量或 VS Code 变量。请写成本机绝对路径或工作区相对路径。`
- `绝对路径不能同时配置 workspaceFolder。`
- `相对路径需要打开工作区。没有打开工作区时请使用绝对路径。`
- `多根工作区使用相对路径时，必须指定唯一的 workspaceFolder。`
- `找不到名为“missing”的工作区文件夹。`
- `工作区文件夹名称“app”重复，无法确定相对路径基准。`
- `相对路径不能越过工作区根目录。工作区外的文件请使用绝对路径。`

## 任务 4：命令入口

**文件：**

- 新建 `vscode-extensions/vscode-quick-open-target/src/extension.ts`

- [x] **步骤 1：注册命令并打开文件**

`activate` 注册 `quickOpenTarget.openFile`。处理函数：

1. 只把 `scheme === "file"` 的工作区传给 `resolveOpenTarget`。
2. 工作区全部不是本机文件、且参数 `path` 不是绝对路径时，提示第一版不能解析远程工作区相对路径。
3. 解析失败时 `showErrorMessage`。
4. `fs.stat`：`ENOENT` 提示找不到文件；其他读取错误单独提示；目录提示目标不是文件。此步骤之前不调用 `openTextDocument`。
5. 打开文档后用 `document.getText()` 和 `resolveCursorOffset` 得到偏移，再 `document.positionAt`。
6. `showTextDocument` 使用 `preview: false`、`preserveFocus: false` 和该选区，随后再次设置 `editor.selection` 并 `revealRange(..., InCenter)`。
7. 打开失败时提示无法打开，不创建文件。

## 任务 5：中文说明

**文件：**

- 新建 `vscode-extensions/vscode-quick-open-target/README.md`

- [x] **步骤 1：写使用说明**

说明安装、macOS / Windows / Linux 的 `keybindings.json` 示例、两种光标模式、相对路径与绝对路径、多根工作区、错误时不会创建文件，以及开发命令 `npm install`、`npm run compile`、`npm test`、`npm run package`。示例快捷键明确写成示例，不表示插件自带绑定。

## 任务 6：验证

- [x] 在插件目录执行 `npm test`，期望看到 `cursor position tests passed` 和 `open target tests passed`。
- [x] 执行 `npm run package`，期望生成 `vscode-quick-open-target-0.1.0.vsix`。
- [x] 记录 VS Code 里的手动验证步骤。当前环境不安装到用户的 VS Code。

手动验证：

1. 安装 `vscode-quick-open-target-0.1.0.vsix`。
2. 在 `keybindings.json` 配两条规则，分别使用 `end` 和 `lastContent`，打开两个不同的已存在文件。
3. 确认编辑器切到前台，光标位置符合模式，文件内容不变。
4. 把路径改成不存在的文件，确认只出现错误提示。

## 任务 3 与任务 4 的实现源码

`src/cursorPosition.ts`：

```typescript
export type CursorMode = "end" | "lastContent";

export function resolveCursorOffset(text: string, mode: CursorMode): number {
  if (mode === "end") {
    return text.length;
  }

  for (let index = text.length - 1; index >= 0; index -= 1) {
    if (!isWhitespace(text[index])) {
      return index + 1;
    }
  }

  return 0;
}

function isWhitespace(character: string): boolean {
  return /\s/.test(character);
}
```

`src/openTarget.ts` 导出 `WorkspaceRoot`、`OpenTargetResult` 和 `resolveOpenTarget`。成功结果是 `{ ok: true, target: { fsPath, cursor } }`，失败结果是 `{ ok: false, message }`。`CursorMode` 从 `cursorPosition.ts` 引入。校验顺序和错误文案按任务 3 执行。绝对路径走 `path.normalize`；相对路径走 `path.resolve` 后用 `path.relative` 拒绝 `..` 越界。

`src/extension.ts` 按任务 4 的七步调用上述两个函数。远程工作区的判断放在解析之前：工作区存在、但没有 `file` scheme，且 `path` 不是当前系统绝对路径时，提示 `第一版只支持本机工作区中的相对路径。` 文件不存在的提示是 `找不到文件：` 加绝对路径；目录提示是 `目标不是文件：` 加绝对路径。

## 自检

- 对齐文档里的路径、光标、错误处理和范围边界都有对应任务。
- 计划中的类型只有一套：`CursorMode`、`WorkspaceRoot`、`resolveCursorOffset`、`resolveOpenTarget`。
- 不实现文件夹定位、图形配置、自动创建文件、默认快捷键和远程 URI。
