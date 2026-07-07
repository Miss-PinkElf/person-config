import { deepEqual, equal } from "node:assert/strict";
import { createTmuxDriver, quoteForShell } from "./tmux-driver.mjs";

equal(quoteForShell("a b"), "'a b'");
equal(quoteForShell("a'b"), "'a'\"'\"'b'");

const calls = [];
const driver = createTmuxDriver({
  execFile: async (file, args) => {
    calls.push([file, args]);
    return { stdout: "screen\n", stderr: "" };
  }
});

await driver.newSession({ sessionName: "devflow-worker-alpha", cwd: "/repo", command: "codex" });
await driver.sendText({ sessionName: "devflow-worker-alpha", text: "hello", submit: true });
const screen = await driver.capturePane({ sessionName: "devflow-worker-alpha" });

deepEqual(calls[0], ["tmux", ["new-session", "-d", "-s", "devflow-worker-alpha", "-c", "/repo", "codex"]]);
deepEqual(calls[1], ["tmux", ["send-keys", "-t", "devflow-worker-alpha", "hello", "Enter"]]);
deepEqual(calls[2], ["tmux", ["capture-pane", "-p", "-t", "devflow-worker-alpha"]]);
equal(screen, "screen\n");

console.log("tmux-driver tests passed");
