import { useEffect, useState } from "react";
import type { ResponseRecord } from "../../shared/questions";
import { getResponses, subscribeToResponses } from "./storage";

export function useResponses() {
  const [records, setRecords] = useState<ResponseRecord[]>(() => getResponses());

  useEffect(() => {
    return subscribeToResponses((msg) => {
      if (msg.type === "response:new") {
        setRecords((prev) => (prev.some((r) => r.id === msg.payload.id) ? prev : [...prev, msg.payload]));
      } else if (msg.type === "responses:reset") {
        setRecords([]);
      }
    });
  }, []);

  return { records };
}
