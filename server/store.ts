import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import type { ResponseRecord } from "../shared/questions.ts";

const DATA_FILE = new URL("../data/responses.json", import.meta.url).pathname;

let cache: ResponseRecord[] | null = null;
let writing: Promise<void> = Promise.resolve();

async function load(): Promise<ResponseRecord[]> {
  if (cache) return cache;
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    cache = JSON.parse(raw) as ResponseRecord[];
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    cache = [];
  }
  return cache;
}

async function persist() {
  const snapshot = cache ?? [];
  await mkdir(dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(snapshot, null, 2), "utf-8");
}

export async function getAll(): Promise<ResponseRecord[]> {
  return load();
}

export async function append(record: ResponseRecord): Promise<void> {
  const all = await load();
  all.push(record);
  // Serialize writes so concurrent submissions never clobber each other.
  writing = writing.then(persist);
  await writing;
}

export async function clearAll(): Promise<void> {
  cache = [];
  writing = writing.then(persist);
  await writing;
}
