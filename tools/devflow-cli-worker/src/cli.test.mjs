import { equal, ok } from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runCli } from "./cli.mjs";

const root = await mkdtemp(join(tmpdir(), "devflow-cli-test-"));
const output = [];
const fakeTmux = {
  newSession: async () => {},
  sendText: async () => {},
  sendKey: async () => {},
  capturePane: async () => "worker screen",
  killSession: async () => {}
};
const fakeTerminal = { open: async () => {} };

try {
  await runCli(["start", "--id", "alpha", "--command", "codex", "--prompt", "原始提示词"], {
    cwd: root,
    stdout: { write: (text) => output.push(text) },
    stderr: { write: (text) => output.push(text) },
    tmux: fakeTmux,
    terminal: fakeTerminal
  });

  ok(output.join("").includes(".devflow/devflow-cli-worker/sessions/alpha/result.md"));

  await runCli(["capture", "alpha"], {
    cwd: root,
    stdout: { write: (text) => output.push(text) },
    stderr: { write: (text) => output.push(text) },
    tmux: fakeTmux,
    terminal: fakeTerminal
  });

  const screen = await readFile(join(root, ".devflow/devflow-cli-worker/sessions/alpha/screen.txt"), "utf8");
  equal(screen, "worker screen");

  console.log("cli tests passed");
} finally {
  await rm(root, { recursive: true, force: true });
}
