import { deepEqual } from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { createConnection } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createBridgeServer } from "./bridgeServer";

void main();

async function main(): Promise<void> {
  const root = await mkdtemp(join(tmpdir(), "devflow-vscode-server-test-"));
  const socketPath = join(root, "bridge.sock");
  const server = await createBridgeServer(socketPath, async (workerId) => ({ ok: true, workerId, reused: false }));

  try {
    const response = await request(socketPath, { action: "attach", workerId: "research-a" });
    deepEqual(response, { ok: true, workerId: "research-a", reused: false });
    console.log("bridge-server tests passed");
  } finally {
    await server.dispose();
    await rm(root, { recursive: true, force: true });
  }
}

function request(path: string, value: object): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const socket = createConnection(path);
    let response = "";
    socket.setEncoding("utf8");
    socket.on("connect", () => socket.write(`${JSON.stringify(value)}\n`));
    socket.on("data", (chunk) => response += chunk);
    socket.on("end", () => resolve(JSON.parse(response.trim())));
    socket.on("error", reject);
  });
}
