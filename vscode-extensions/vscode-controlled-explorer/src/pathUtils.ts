import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

export function normalizeSlashes(pathValue: string): string {
  return pathValue.replace(/\\/g, "/");
}

export function toWorkspaceRelativePath(
  absolutePath: string,
  workspaceFolderPaths: string[]
): string {
  const workspace = findContainingWorkspace(absolutePath, workspaceFolderPaths);
  if (!workspace) {
    return normalizeSlashes(absolutePath);
  }

  return normalizeSlashes(relative(workspace, absolutePath));
}

export function resolveConfiguredPath(
  configuredPath: string,
  workspaceFolderPaths: string[]
): string {
  if (isAbsolute(configuredPath)) {
    return configuredPath;
  }

  const firstWorkspace = workspaceFolderPaths[0];
  if (!firstWorkspace) {
    return resolve(configuredPath);
  }

  return resolve(firstWorkspace, configuredPath);
}

export function parentDirectoryPath(pathValue: string): string {
  return dirname(pathValue);
}

export function shellQuote(pathValue: string): string {
  return `'${pathValue.replace(/'/g, "'\\''")}'`;
}

export function parseUriList(rawValue: string): string[] {
  return rawValue
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line) => decodeURIComponent(line.replace(/^file:\/\//, "")));
}

function findContainingWorkspace(
  absolutePath: string,
  workspaceFolderPaths: string[]
): string | undefined {
  const normalizedPath = normalizeForCompare(absolutePath);

  return workspaceFolderPaths
    .map((workspacePath) => normalizeForCompare(workspacePath))
    .filter((workspacePath) => {
      return (
        normalizedPath === workspacePath ||
        normalizedPath.startsWith(`${workspacePath}${sep}`) ||
        normalizedPath.startsWith(`${workspacePath}/`)
      );
    })
    .sort((left, right) => right.length - left.length)[0];
}

function normalizeForCompare(pathValue: string): string {
  return resolve(pathValue);
}
