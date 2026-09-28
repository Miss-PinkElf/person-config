import { equal } from "node:assert/strict";
import * as path from "node:path";
import { resolveOpenTarget, type OpenTargetResult, type WorkspaceRoot } from "./openTarget";

const appRoot = path.resolve("/workspace/app");
const notesRoot = path.resolve("/workspace/notes");
const otherAppRoot = path.resolve("/other/app");

const singleRoot: readonly WorkspaceRoot[] = [{ name: "app", fsPath: appRoot }];
const multiRoot: readonly WorkspaceRoot[] = [
  { name: "app", fsPath: appRoot },
  { name: "notes", fsPath: notesRoot }
];
const duplicateRoot: readonly WorkspaceRoot[] = [
  { name: "app", fsPath: appRoot },
  { name: "app", fsPath: otherAppRoot }
];

function expectError(result: OpenTargetResult, message: string): void {
  equal(result.ok, false);
  if (!result.ok) {
    equal(result.message, message);
  }
}

expectError(resolveOpenTarget(null, singleRoot), "快捷键参数必须是对象，并包含 path。");
expectError(resolveOpenTarget(["notes/today.md"], singleRoot), "快捷键参数必须是对象，并包含 path。");
expectError(resolveOpenTarget("notes/today.md", singleRoot), "快捷键参数必须是对象，并包含 path。");
expectError(resolveOpenTarget({}, singleRoot), "快捷键参数 path 必须是非空字符串。");
expectError(resolveOpenTarget({ path: "   " }, singleRoot), "快捷键参数 path 必须是非空字符串。");
expectError(
  resolveOpenTarget({ path: "notes/today.md", file: "notes/today.md" }, singleRoot),
  "快捷键参数包含未知字段“file”。只允许 path、cursor、workspaceFolder。"
);

const relative = resolveOpenTarget({ path: "notes/today.md" }, singleRoot);
equal(relative.ok, true);
if (relative.ok) {
  equal(relative.target.fsPath, path.resolve(appRoot, "notes/today.md"));
  equal(relative.target.cursor, "end");
}

const lastContent = resolveOpenTarget({ path: "notes/today.md", cursor: "lastContent" }, singleRoot);
equal(lastContent.ok, true);
if (lastContent.ok) {
  equal(lastContent.target.cursor, "lastContent");
}

expectError(
  resolveOpenTarget({ path: "notes/today.md", cursor: "start" }, singleRoot),
  "cursor 只能是 end 或 lastContent。"
);

const absolutePath = path.resolve("/var/notes/inbox.md");
const absolute = resolveOpenTarget({ path: absolutePath, cursor: "lastContent" }, []);
equal(absolute.ok, true);
if (absolute.ok) {
  equal(absolute.target.fsPath, path.normalize(absolutePath));
  equal(absolute.target.cursor, "lastContent");
}

expectError(
  resolveOpenTarget({ path: absolutePath, workspaceFolder: "app" }, singleRoot),
  "绝对路径不能同时配置 workspaceFolder。"
);

expectError(
  resolveOpenTarget({ path: "notes/today.md" }, []),
  "相对路径需要打开工作区。没有打开工作区时请使用绝对路径。"
);

expectError(
  resolveOpenTarget({ path: "notes/today.md" }, multiRoot),
  "多根工作区使用相对路径时，必须指定唯一的 workspaceFolder。"
);

const namedRoot = resolveOpenTarget({ path: "inbox.md", workspaceFolder: "notes" }, multiRoot);
equal(namedRoot.ok, true);
if (namedRoot.ok) {
  equal(namedRoot.target.fsPath, path.resolve(notesRoot, "inbox.md"));
}

expectError(
  resolveOpenTarget({ path: "inbox.md", workspaceFolder: "missing" }, multiRoot),
  "找不到名为“missing”的工作区文件夹。"
);

expectError(
  resolveOpenTarget({ path: "inbox.md", workspaceFolder: "app" }, duplicateRoot),
  "工作区文件夹名称“app”重复，无法确定相对路径基准。"
);

expectError(
  resolveOpenTarget({ path: "inbox.md", workspaceFolder: "notes" }, singleRoot),
  "找不到名为“notes”的工作区文件夹。"
);

const namedSingle = resolveOpenTarget({ path: "inbox.md", workspaceFolder: "app" }, singleRoot);
equal(namedSingle.ok, true);
if (namedSingle.ok) {
  equal(namedSingle.target.fsPath, path.resolve(appRoot, "inbox.md"));
}

expectError(
  resolveOpenTarget({ path: "../outside.md" }, singleRoot),
  "相对路径不能越过工作区根目录。工作区外的文件请使用绝对路径。"
);

const stayedInside = resolveOpenTarget({ path: "notes/../today.md" }, singleRoot);
equal(stayedInside.ok, true);
if (stayedInside.ok) {
  equal(stayedInside.target.fsPath, path.resolve(appRoot, "today.md"));
}

expectError(resolveOpenTarget({ path: "~" }, singleRoot), "不支持用 ~ 表示用户主目录，请改成绝对路径。");
expectError(resolveOpenTarget({ path: "~/notes.md" }, singleRoot), "不支持用 ~ 表示用户主目录，请改成绝对路径。");
expectError(
  resolveOpenTarget({ path: "file:///tmp/a.md" }, singleRoot),
  "不支持 URI。请使用本机绝对路径或工作区相对路径。"
);
expectError(
  resolveOpenTarget({ path: "${workspaceFolder}/a.md" }, singleRoot),
  "不支持环境变量或 VS Code 变量。请写成本机绝对路径或工作区相对路径。"
);
expectError(
  resolveOpenTarget({ path: "$HOME/a.md" }, singleRoot),
  "不支持环境变量或 VS Code 变量。请写成本机绝对路径或工作区相对路径。"
);
expectError(
  resolveOpenTarget({ path: "%USERPROFILE%/a.md" }, singleRoot),
  "不支持环境变量或 VS Code 变量。请写成本机绝对路径或工作区相对路径。"
);
expectError(
  resolveOpenTarget({ path: "a.md", workspaceFolder: "  " }, singleRoot),
  "workspaceFolder 必须是非空字符串。"
);
expectError(
  resolveOpenTarget({ path: "a.md", workspaceFolder: 1 }, singleRoot),
  "workspaceFolder 必须是非空字符串。"
);

console.log("open target tests passed");
