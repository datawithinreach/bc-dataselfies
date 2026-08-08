import { useEffect, useRef, useState } from "react";
import type { ResponseRecord } from "../../shared/questions";

interface WsMessage {
  type: "response:new" | "responses:reset";
  payload: ResponseRecord | null;
}

export function useResponses() {
  const [records, setRecords] = useState<ResponseRecord[]>([]);
  const [connected, setConnected] = useState(false);
  const retryDelay = useRef(1000);

  useEffect(() => {
    let cancelled = false;
    let ws: WebSocket | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    async function loadInitial() {
      try {
        const res = await fetch("/api/responses");
        const data: ResponseRecord[] = await res.json();
        if (!cancelled) setRecords(data);
      } catch {
        // will retry once the socket is up
      }
    }

    function connect() {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

      ws.onopen = () => {
        retryDelay.current = 1000;
        setConnected(true);
      };

      ws.onmessage = (event) => {
        const msg: WsMessage = JSON.parse(event.data);
        if (msg.type === "response:new" && msg.payload) {
          setRecords((prev) => (prev.some((r) => r.id === msg.payload!.id) ? prev : [...prev, msg.payload!]));
        } else if (msg.type === "responses:reset") {
          setRecords([]);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        if (cancelled) return;
        retryTimer = setTimeout(connect, retryDelay.current);
        retryDelay.current = Math.min(retryDelay.current * 1.5, 10000);
      };

      ws.onerror = () => {
        ws?.close();
      };
    }

    loadInitial();
    connect();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      ws?.close();
    };
  }, []);

  return { records, connected };
}
