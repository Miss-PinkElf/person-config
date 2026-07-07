import { equal } from "node:assert/strict";
import { compareByFrequencyThenName } from "./frequencyService";

const items = [
  { key: "b", label: "b.ts" },
  { key: "a", label: "a.ts" },
  { key: "c", label: "c.ts" },
].sort((left, right) =>
  compareByFrequencyThenName(left, right, {
    b: 1,
    c: 3,
  })
);

equal(items[0].key, "c");
equal(items[1].key, "b");
equal(items[2].key, "a");

console.log("frequencyService tests passed");
