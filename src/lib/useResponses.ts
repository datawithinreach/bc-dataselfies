import { useEffect, useState } from "react";
import type { ResponseRecord } from "../../shared/questions";
import { getResponses, subscribeToResponses } from "./storage";

export function useResponses() {
  const [records, setRecords] = useState<ResponseRecord[]>(() => getResponses());

  useEffect(() => {
    return subscribeToResponses((msg) => {
      if (msg.type === "response:new") {
        setRecords((prev) => (prev.some((r) => r.id === msg.payload.id) ? prev : [...prev, msg.payload]));
      } else if (msg.type === "responses:bulkAdd") {
        setRecords((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const fresh = msg.payload.filter((r) => !existingIds.has(r.id));
          return fresh.length > 0 ? [...prev, ...fresh] : prev;
        });
      } else if (msg.type === "responses:reset") {
        setRecords([]);
      }
    });
  }, []);

  return { records };
}
