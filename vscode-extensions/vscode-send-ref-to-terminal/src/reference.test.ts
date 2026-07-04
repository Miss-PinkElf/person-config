import { equal } from "node:assert/strict";
import { buildLineReference, normalizeReferencePath } from "./reference";

equal(normalizeReferencePath("src\\example.ts"), "src/example.ts");
equal(normalizeReferencePath("src/example.ts"), "src/example.ts");

equal(
  buildLineReference({ relativePath: "src/example.ts", startLine: 12, endLine: 12 }),
  "@src/example.ts#L12 "
);

equal(
  buildLineReference({ relativePath: "src\\example.ts", startLine: 12, endLine: 20 }),
  "@src/example.ts#L12-20 "
);

console.log("reference tests passed");
