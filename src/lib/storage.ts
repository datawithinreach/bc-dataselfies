import { nanoid } from "nanoid";
import { sanitizeResponseInput, type ResponseRecord } from "../../shared/questions";

// Everything lives in this one browser's localStorage — no server, no
// network. /submit and /display are two windows of the *same* browser
// pointed at the same origin, so they share storage automatically, and a
// BroadcastChannel tells the other window the instant something changes.
// (This intentionally only supports the single-laptop kiosk setup: two
// windows, same browser, same machine — not submissions from other devices.)

const STORAGE_KEY = "bc-data-selfies:responses";
const CHANNEL_NAME = "bc-data-selfies";
const EVENT_NAME = "change";

type ChannelMessage =
  | { type: "response:new"; payload: ResponseRecord }
  | { type: "responses:bulkAdd"; payload: ResponseRecord[] }
  | { type: "responses:reset" };

// BroadcastChannel never delivers a message back to the tab that sent it, so
// route every update (local or cross-tab) through this same EventTarget —
// a page that writes and a page that only listens both get notified the
// same way, whether they're the same window or a different one.
const local = new EventTarget();
let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === "undefined") return null;
  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.addEventListener("message", (event: MessageEvent<ChannelMessage>) => {
      local.dispatchEvent(new CustomEvent<ChannelMessage>(EVENT_NAME, { detail: event.data }));
    });
  }
  return channel;
}

function emit(message: ChannelMessage) {
  local.dispatchEvent(new CustomEvent<ChannelMessage>(EVENT_NAME, { detail: message }));
  getChannel()?.postMessage(message);
}

function readAll(): ResponseRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ResponseRecord[]) : [];
  } catch {
    return [];
  }
}

function writeAll(records: ResponseRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getResponses(): ResponseRecord[] {
  return readAll();
}

export function addResponse(record: ResponseRecord) {
  const all = readAll();
  all.push(record);
  writeAll(all);
  emit({ type: "response:new", payload: record });
}

export function resetResponses() {
  writeAll([]);
  emit({ type: "responses:reset" });
}

/** Subscribe to changes, whether made in this window or another one. Returns an unsubscribe function. */
export function subscribeToResponses(onMessage: (msg: ChannelMessage) => void): () => void {
  getChannel();
  const handler = (event: Event) => onMessage((event as CustomEvent<ChannelMessage>).detail);
  local.addEventListener(EVENT_NAME, handler);
  return () => local.removeEventListener(EVENT_NAME, handler);
}

/** Serialize every stored response for download. */
export function exportResponses(): string {
  return JSON.stringify(readAll(), null, 2);
}

export interface ImportResult {
  added: number;
  skipped: number;
}

/**
 * Merges an uploaded file's responses into local storage. Each item is
 * re-validated against the current question set (sanitizeResponseInput) so
 * malformed or stale-schema entries can't crash the wall — they're just
 * skipped and counted instead. IDs are reused when present and not already
 * taken (so re-uploading the same export twice doesn't duplicate people),
 * otherwise a fresh one is minted.
 */
export function importResponses(raw: unknown): ImportResult {
  const candidates = Array.isArray(raw) ? raw : [];
  const existing = readAll();
  const seenIds = new Set(existing.map((r) => r.id));
  const added: ResponseRecord[] = [];

  for (const item of candidates) {
    const input = sanitizeResponseInput(item);
    if (!input) continue;

    const providedId = typeof (item as { id?: unknown })?.id === "string" ? (item as { id: string }).id : "";
    if (providedId && seenIds.has(providedId)) continue; // already have this person — skip, don't duplicate them
    const id = providedId || nanoid(10);
    seenIds.add(id);

    const createdAtRaw = (item as { createdAt?: unknown })?.createdAt;
    const createdAt = typeof createdAtRaw === "number" ? createdAtRaw : Date.now();

    added.push({ ...input, id, createdAt });
  }

  if (added.length > 0) {
    writeAll([...existing, ...added]);
    emit({ type: "responses:bulkAdd", payload: added });
  }

  return { added: added.length, skipped: candidates.length - added.length };
}
