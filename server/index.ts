import express from "express";
import { createServer } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { nanoid } from "nanoid";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { validateResponse, type ResponseInput, type ResponseRecord } from "../shared/questions.ts";
import { getAll, append, clearAll } from "./store.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 8787);
const RESET_TOKEN = process.env.RESET_TOKEN ?? "bc-open-house";

const app = express();
app.use(express.json({ limit: "10kb" }));

const server = createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

function broadcast(type: string, payload: unknown) {
  const msg = JSON.stringify({ type, payload });
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  }
}

app.get("/api/responses", async (_req, res) => {
  res.json(await getAll());
});

app.post("/api/responses", async (req, res) => {
  const input = req.body as Partial<ResponseInput>;
  const error = validateResponse(input);
  if (error) {
    res.status(400).json({ error });
    return;
  }
  const record: ResponseRecord = {
    id: nanoid(10),
    name: input.name!.trim(),
    affiliation: input.affiliation!,
    school: input.school!,
    continent: input.continent!,
    chronotype: input.chronotype!,
    bestIdeas: input.bestIdeas!,
    rules: input.rules!,
    emailAnxiety: input.emailAnxiety!,
    aiFuture: input.aiFuture!,
    createdAt: Date.now(),
  };
  await append(record);
  broadcast("response:new", record);
  res.status(201).json(record);
});

// Manual reset for testing before the event. Requires a shared token so a stray
// request can't wipe the wall of portraits mid-open-house.
app.post("/api/reset", async (req, res) => {
  if (req.body?.token !== RESET_TOKEN) {
    res.status(403).json({ error: "Invalid reset token" });
    return;
  }
  await clearAll();
  broadcast("responses:reset", null);
  res.status(204).end();
});

if (process.env.NODE_ENV === "production") {
  const distDir = path.join(__dirname, "..", "dist");
  app.use(express.static(distDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`BC Data Selfies server listening on http://localhost:${PORT}`);
});
