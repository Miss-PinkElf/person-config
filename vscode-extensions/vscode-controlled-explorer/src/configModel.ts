import { basename } from "node:path";
import {
  ControlledEntry,
  ControlledEntrySource,
  ControlledExplorerConfig,
  ControlledRoot,
} from "./types";

const TYPE_ORDER: Record<ControlledEntry["type"], number> = {
  group: 0,
  folder: 1,
  file: 2,
};

export function emptyConfig(): ControlledExplorerConfig {
  return {
    version: 1,
    roots: [],
  };
}

export function entryLabel(entry: ControlledEntry): string {
  if (entry.name && entry.name.trim().length > 0) {
    return entry.name;
  }

  if (entry.type === "group") {
    return "未命名分组";
  }

  return basename(entry.path);
}

export function sortEntriesDefault(entries: ControlledEntry[]): ControlledEntry[] {
  return entries
    .map((entry) => cloneEntry(entry))
    .sort(compareEntriesDefault)
    .map((entry) => {
      if (entry.type !== "group") {
        return entry;
      }

      return {
        ...entry,
        children: sortEntriesDefault(entry.children ?? []),
      };
    });
}

export function normalizeConfig(input: unknown): ControlledExplorerConfig {
  if (!isObject(input)) {
    return emptyConfig();
  }

  const roots = Array.isArray(input.roots)
    ? input.roots.flatMap((entry) => normalizeEntry(entry))
    : [];

  return {
    version: typeof input.version === "number" ? input.version : 1,
    roots,
  };
}

export function flattenRoots(
  roots: ControlledEntry[],
  source: ControlledEntrySource,
  parentPath: number[] = []
): ControlledRoot[] {
  return roots.flatMap((entry, index) => {
    const indexPath = [...parentPath, index];
    const current: ControlledRoot = { entry, source, indexPath };

    if (entry.type !== "group") {
      return [current];
    }

    return [
      current,
      ...flattenRoots(entry.children ?? [], source, indexPath),
    ];
  });
}

export function removeEntryAtIndexPath(
  entries: ControlledEntry[],
  indexPath: number[]
): ControlledEntry[] {
  if (indexPath.length === 0) {
    return entries;
  }

  const [targetIndex, ...rest] = indexPath;

  return entries.flatMap((entry, index) => {
    if (index !== targetIndex) {
      return [cloneEntry(entry)];
    }

    if (rest.length === 0) {
      return [];
    }

    if (entry.type !== "group") {
      return [cloneEntry(entry)];
    }

    return [
      {
        ...cloneEntry(entry),
        children: removeEntryAtIndexPath(entry.children ?? [], rest),
      },
    ];
  });
}

export function hasEntryPath(entries: ControlledEntry[], pathToFind: string): boolean {
  const normalized = pathToFind.replace(/\\/g, "/");

  return entries.some((entry) => {
    if (entry.type === "group") {
      return hasEntryPath(entry.children ?? [], normalized);
    }

    return entry.path.replace(/\\/g, "/") === normalized;
  });
}

export function cloneEntry(entry: ControlledEntry): ControlledEntry {
  if (entry.type === "group") {
    return {
      type: "group",
      name: entry.name,
      children: (entry.children ?? []).map((child) => cloneEntry(child)),
    };
  }

  return {
    type: entry.type,
    name: entry.name,
    path: entry.path,
  };
}

export function compareEntriesDefault(left: ControlledEntry, right: ControlledEntry): number {
  const typeDiff = TYPE_ORDER[left.type] - TYPE_ORDER[right.type];
  if (typeDiff !== 0) {
    return typeDiff;
  }

  return entryLabel(left).localeCompare(entryLabel(right), "zh-Hans-CN", {
    sensitivity: "base",
    numeric: true,
  });
}

function normalizeEntry(entry: unknown): ControlledEntry[] {
  if (!isObject(entry) || typeof entry.type !== "string") {
    return [];
  }

  const name = typeof entry.name === "string" ? entry.name : undefined;

  if (entry.type === "group") {
    return [
      {
        type: "group",
        name,
        children: Array.isArray(entry.children)
          ? entry.children.flatMap((child) => normalizeEntry(child))
          : [],
      },
    ];
  }

  if ((entry.type === "folder" || entry.type === "file") && typeof entry.path === "string") {
    return [
      {
        type: entry.type,
        name,
        path: entry.path,
      },
    ];
  }

  return [];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
