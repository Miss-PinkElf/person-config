import { deepEqual, equal } from "node:assert/strict";
import {
  entryLabel,
  hasEntryPath,
  normalizeConfig,
  removeEntryAtIndexPath,
  sortEntriesDefault,
} from "./configModel";

const sorted = sortEntriesDefault([
  { type: "file", path: "b.ts" },
  { type: "folder", path: "src" },
  { type: "group", name: "常用", children: [{ type: "file", path: "z.ts" }] },
  { type: "file", path: "a.ts" },
]);

deepEqual(
  sorted.map((entry) => entry.type),
  ["group", "folder", "file", "file"]
);

deepEqual(
  sorted.map((entry) => entryLabel(entry)),
  ["常用", "src", "a.ts", "b.ts"]
);

const normalized = normalizeConfig({
  version: 1,
  roots: [
    { type: "file", path: "src/a.ts" },
    { type: "unknown", path: "src/b.ts" },
    { type: "group", name: "G", children: [{ type: "folder", path: "src" }] },
  ],
});

equal(normalized.roots.length, 2);
equal(hasEntryPath(normalized.roots, "src/a.ts"), true);
equal(hasEntryPath(normalized.roots, "src/missing.ts"), false);

deepEqual(removeEntryAtIndexPath(normalized.roots, [1, 0]), [
  { type: "file", name: undefined, path: "src/a.ts" },
  { type: "group", name: "G", children: [] },
]);

console.log("configModel tests passed");
