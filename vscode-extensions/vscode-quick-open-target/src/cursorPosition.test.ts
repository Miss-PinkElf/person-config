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
