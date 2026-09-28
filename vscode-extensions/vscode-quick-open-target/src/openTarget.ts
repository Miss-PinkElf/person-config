import * as path from "node:path";
import type { CursorMode } from "./cursorPosition";

export interface WorkspaceRoot {
  name: string;
  fsPath: string;
}

export interface ResolvedOpenTarget {
  fsPath: string;
  cursor: CursorMode;
}

export type OpenTargetResult =
  | { ok: true; target: ResolvedOpenTarget }
  | { ok: false; message: string };

const KNOWN_KEYS = new Set(["path", "cursor", "workspaceFolder"]);

export function resolveOpenTarget(
  args: unknown,
  workspaceFolders: readonly WorkspaceRoot[]
): OpenTargetResult {
  if (args === null || typeof args !== "object" || Array.isArray(args)) {
    return fail("快捷键参数必须是对象，并包含 path。");
  }

  const record = args as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!KNOWN_KEYS.has(key)) {
      return fail(`快捷键参数包含未知字段“${key}”。只允许 path、cursor、workspaceFolder。`);
    }
  }

  if (typeof record.path !== "string" || record.path.trim() === "") {
    return fail("快捷键参数 path 必须是非空字符串。");
  }

  const cursor = parseCursor(record.cursor);
  if (!cursor.ok) {
    return cursor;
  }

  const workspaceFolder = parseWorkspaceFolder(record.workspaceFolder);
  if (!workspaceFolder.ok) {
    return workspaceFolder;
  }

  const unsupported = rejectUnsupportedPath(record.path);
  if (unsupported) {
    return unsupported;
  }

  if (path.isAbsolute(record.path)) {
    if (workspaceFolder.value !== undefined) {
      return fail("绝对路径不能同时配置 workspaceFolder。");
    }
    return ok(path.normalize(record.path), cursor.value);
  }

  if (workspaceFolders.length === 0) {
    return fail("相对路径需要打开工作区。没有打开工作区时请使用绝对路径。");
  }

  const root = selectWorkspaceRoot(workspaceFolders, workspaceFolder.value);
  if (!root.ok) {
    return root;
  }

  const rootPath = path.resolve(root.value.fsPath);
  const resolved = path.resolve(rootPath, record.path);
  const relative = path.relative(rootPath, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return fail("相对路径不能越过工作区根目录。工作区外的文件请使用绝对路径。");
  }

  return ok(resolved, cursor.value);
}

function fail(message: string): { ok: false; message: string } {
  return { ok: false, message };
}

function ok(fsPath: string, cursor: CursorMode): OpenTargetResult {
  return { ok: true, target: { fsPath, cursor } };
}

type StepResult<T> = { ok: true; value: T } | { ok: false; message: string };

function parseCursor(value: unknown): StepResult<CursorMode> {
  if (value === undefined) {
    return { ok: true, value: "end" };
  }
  if (value === "end" || value === "lastContent") {
    return { ok: true, value };
  }
  return { ok: false, message: "cursor 只能是 end 或 lastContent。" };
}

function parseWorkspaceFolder(value: unknown): StepResult<string | undefined> {
  if (value === undefined) {
    return { ok: true, value: undefined };
  }
  if (typeof value !== "string" || value.trim() === "") {
    return { ok: false, message: "workspaceFolder 必须是非空字符串。" };
  }
  return { ok: true, value };
}

function rejectUnsupportedPath(rawPath: string): OpenTargetResult | undefined {
  if (rawPath === "~" || rawPath.startsWith("~/") || rawPath.startsWith("~\\")) {
    return fail("不支持用 ~ 表示用户主目录，请改成绝对路径。");
  }
  if (rawPath.includes("://")) {
    return fail("不支持 URI。请使用本机绝对路径或工作区相对路径。");
  }
  if (rawPath.includes("${") || /\$[A-Za-z_]/.test(rawPath) || /%[A-Za-z_][A-Za-z0-9_]*%/.test(rawPath)) {
    return fail("不支持环境变量或 VS Code 变量。请写成本机绝对路径或工作区相对路径。");
  }
  return undefined;
}

function selectWorkspaceRoot(
  folders: readonly WorkspaceRoot[],
  requestedName: string | undefined
): StepResult<WorkspaceRoot> {
  if (requestedName === undefined) {
    if (folders.length !== 1) {
      return fail("多根工作区使用相对路径时，必须指定唯一的 workspaceFolder。");
    }
    return { ok: true, value: folders[0] };
  }

  const matches = folders.filter((folder) => folder.name === requestedName);
  if (matches.length === 0) {
    return fail(`找不到名为“${requestedName}”的工作区文件夹。`);
  }
  if (matches.length > 1) {
    return fail(`工作区文件夹名称“${requestedName}”重复，无法确定相对路径基准。`);
  }
  return { ok: true, value: matches[0] };
}
