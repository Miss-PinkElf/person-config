import { unlink } from "node:fs/promises";
import { createServer, Server } from "node:net";

export interface AttachResponse {
  ok: true;
  workerId: string;
  reused: boolean;
}

export interface BridgeServer {
  dispose(): Promise<void>;
}

export async function createBridgeServer(
  socketPath: string,
  attach: (workerId: string) => Promise<AttachResponse>
): Promise<BridgeServer> {
  await removeSocket(socketPath);
  const server = createServer((socket) => {
    socket.setEncoding("utf8");
    let buffer = "";
    socket.on("data", async (chunk) => {
      buffer += chunk;
      const lineEnd = buffer.indexOf("\n");
      if (lineEnd < 0) return;

      try {
        const request = JSON.parse(buffer.slice(0, lineEnd));
        if (request.action !== "attach" || typeof request.workerId !== "string") {
          writeResponse(socket, { ok: false, error: "无效的 VSCode attach 请求。" });
          return;
        }
        writeResponse(socket, await attach(request.workerId));
      } catch (error) {
        writeResponse(socket, { ok: false, error: error instanceof Error ? error.message : "处理 VSCode attach 请求失败。" });
      }
    });
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(socketPath, () => {
      server.off("error", reject);
      resolve();
    });
  });

  return {
    async dispose(): Promise<void> {
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
      await removeSocket(socketPath);
    }
  };
}

function writeResponse(socket: import("node:net").Socket, response: object): void {
  socket.end(`${JSON.stringify(response)}\n`);
}

async function removeSocket(socketPath: string): Promise<void> {
  try {
    await unlink(socketPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}
