import { deepEqual, equal } from "node:assert/strict";
import {
  normalizeSlashes,
  parseUriList,
  resolveConfiguredPath,
  shellQuote,
  toWorkspaceRelativePath,
} from "./pathUtils";

equal(normalizeSlashes("a\\b\\c.ts"), "a/b/c.ts");
equal(toWorkspaceRelativePath("/repo/src/a.ts", ["/repo"]), "src/a.ts");
equal(resolveConfiguredPath("src/a.ts", ["/repo"]), "/repo/src/a.ts");
equal(shellQuote("/tmp/a b's.ts"), "'/tmp/a b'\\''s.ts'");

deepEqual(parseUriList("file:///tmp/a%20b.ts\n# comment\nfile:///tmp/c.ts"), [
  "/tmp/a b.ts",
  "/tmp/c.ts",
]);

console.log("pathUtils tests passed");
