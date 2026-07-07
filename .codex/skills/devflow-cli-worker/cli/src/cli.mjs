import { readFile, writeFile } from "node:fs/promises";
import { createMacOSTerminalOpener } from "./macos-terminal.mjs";
import { createSessionStore } from "./session-store.mjs";
import { createTmuxDriver } from "./tmux-driver.mjs";
import { waitForStableScreen } from "./wait-agent.mjs";

const USAGE_TEXT = "可用命令：start、start-in-vscode、send、paste、capture、get-info、wait-agent、interrupt、key、kill、status、transcript。\n";

export async function runCli(argv, options) {
  const context = createContext(options);
  const [command, ...rest] = argv;

  if (command === "--help" || command === "-h" || command === "help") {
    context.stdout.write(USAGE_TEXT);
    return;
  }

  if (command === "start") return start(rest, context, "terminal");
  if (command === "start-in-vscode") return start(rest, context, "vscode");
  if (command === "send") return send(rest, context, true);
  if (command === "paste") return send(rest, context, false);
  if (command === "capture") return capture(rest, context);
  if (command === "get-info") return getInfo(rest, context);
  if (command === "wait-agent") return waitAgent(rest, context);
  if (command === "interrupt") return keyCommand(rest, context, "C-c");
  if (command === "key") return keyCommand(rest, context);
  if (command === "kill") return kill(rest, context);
  if (command === "status") return status(rest, context);
  if (command === "transcript") return transcript(rest, context);

  throw new Error(`未知命令。${USAGE_TEXT.trim()}`);
}

function createContext(options) {
  return {
    cwd: options.cwd,
    stdout: options.stdout,
    stderr: options.stderr,
    store: createSessionStore({ repoRoot: options.cwd }),
    tmux: options.tmux ?? createTmuxDriver(),
    terminal: options.terminal ?? createMacOSTerminalOpener()
  };
}

async function start(args, context, visualMode) {
  const id = readOption(args, "--id") ?? `worker-${Date.now()}`;
  const command = readOption(args, "--command") ?? "codex";
  const prompt = readOption(args, "--prompt") ?? "";
  const terminalApp = readOption(args, "--terminal") ?? "terminal";
  const session = await context.store.createSession({ workerId: id, command, prompt, visualMode });

  await context.tmux.newSession({
    sessionName: session.tmuxSessionName,
    cwd: context.cwd,
    command
  });

  if (prompt) {
    await context.tmux.sendText({ sessionName: session.tmuxSessionName, text: prompt, submit: true });
  }

  if (visualMode === "terminal") {
    await context.terminal.open({
      terminalApp,
      attachCommand: `tmux attach -t ${session.tmuxSessionName}`
    });
  }

  await context.store.updateSession(id, { status: "running" });
  await context.store.appendTranscript(id, `start command=${command} result=${session.relativeResultPath}`);
  context.stdout.write(`worker ${id} started\nresult: ${session.relativeResultPath}\n`);
}

async function send(args, context, submit) {
  const [id, ...messageParts] = args;
  const session = await context.store.readSession(id);
  const text = messageParts.join(" ");
  await context.tmux.sendText({ sessionName: session.tmuxSessionName, text, submit });
  await context.store.appendTranscript(id, `${submit ? "send" : "paste"} ${text}`);
}

async function capture(args, context) {
  const [id] = args;
  const session = await context.store.readSession(id);
  const screen = await context.tmux.capturePane({ sessionName: session.tmuxSessionName });
  await writeFile(session.absoluteScreenPath, screen, "utf8");
  context.stdout.write(screen);
}

async function getInfo(args, context) {
  const [id] = args;
  const tail = Number(readOption(args, "--tail") ?? "20");
  const session = await context.store.readSession(id);
  const screen = await context.tmux.capturePane({ sessionName: session.tmuxSessionName });
  const lines = screen.split(/\r?\n/).slice(-tail).join("\n");
  context.stdout.write(JSON.stringify({
    workerId: session.workerId,
    status: session.status,
    result: session.relativeResultPath,
    tail: lines
  }, null, 2) + "\n");
}

async function waitAgent(args, context) {
  const [id] = args;
  const session = await context.store.readSession(id);
  const result = await waitForStableScreen({
    capture: () => context.tmux.capturePane({ sessionName: session.tmuxSessionName }),
    timeoutMs: Number(readOption(args, "--timeout") ?? "1200") * 1000,
    pollMs: Number(readOption(args, "--poll") ?? "15") * 1000,
    staleMs: Number(readOption(args, "--stale") ?? "30") * 1000
  });
  context.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

async function keyCommand(args, context, defaultKey) {
  const [id, key = defaultKey] = args;
  const session = await context.store.readSession(id);
  await context.tmux.sendKey({ sessionName: session.tmuxSessionName, key });
}

async function kill(args, context) {
  const [id] = args;
  const session = await context.store.readSession(id);
  await context.tmux.killSession({ sessionName: session.tmuxSessionName });
  await context.store.updateSession(id, { status: "killed" });
}

async function status(args, context) {
  const [id] = args;
  const session = await context.store.readSession(id);
  context.stdout.write(JSON.stringify(session, null, 2) + "\n");
}

async function transcript(args, context) {
  const [id] = args;
  const session = context.store.resolveSession(id);
  context.stdout.write(await readFile(session.absoluteTranscriptPath, "utf8"));
}

function readOption(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}
