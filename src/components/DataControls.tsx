import { useRef, useState } from "react";
import { exportResponses, importResponses } from "../lib/storage";

export default function DataControls() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  function announce(message: string) {
    setStatus(message);
    setTimeout(() => setStatus((current) => (current === message ? null : current)), 4000);
  }

  function handleDownload() {
    const blob = new Blob([exportResponses()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bc-data-selfies-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const { added, skipped } = importResponses(parsed);
      announce(skipped > 0 ? `Added ${added}, skipped ${skipped}` : `Added ${added}`);
    } catch {
      announce("Couldn't read that file");
    }
  }

  return (
    <div className="data-controls">
      <button type="button" className="data-controls-btn" onClick={handleDownload}>
        Download responses
      </button>
      <span aria-hidden="true">·</span>
      <button type="button" className="data-controls-btn" onClick={() => fileInputRef.current?.click()}>
        Upload responses
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="data-controls-file-input"
        onChange={handleFileChange}
      />
      {status && <p className="data-controls-status">{status}</p>}
    </div>
  );
}
