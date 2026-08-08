import { useEffect, useRef, useState } from "react";
import { describeResponse } from "../../shared/questions";
import { useResponses } from "../lib/useResponses";
import { useForceLayout } from "../lib/useForceLayout";
import { resetResponses } from "../lib/storage";
import PortraitMark from "../components/PortraitMark";
import Legend from "../components/Legend";

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      // Debounced so an active window drag-resize restarts the force
      // simulation once it settles, not dozens of times mid-drag.
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }, 200);
    });
    observer.observe(el);
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, []);

  return [ref, size] as const;
}

function handleResetClick() {
  if (window.confirm("Clear all portraits from the wall? This can't be undone.")) {
    resetResponses();
  }
}

export default function DisplayPage() {
  const { records } = useResponses();
  const [canvasRef, { width, height }] = useElementSize<HTMLDivElement>();
  const nodes = useForceLayout(records, width, height);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hoveredNode = hoveredId ? nodes.find((n) => n.id === hoveredId) : undefined;

  return (
    <div className="page display-page">
      <div className="canvas" ref={canvasRef}>
        <svg width={width} height={height}>
          {nodes.map((n) => (
            <PortraitMark
              key={n.id}
              record={n.record}
              x={n.x ?? 0}
              y={n.y ?? 0}
              r={n.r}
              onHoverChange={(hovering) => setHoveredId(hovering ? n.id : null)}
            />
          ))}
        </svg>
        {hoveredNode && (
          <div
            className="node-tooltip"
            style={{ left: hoveredNode.x ?? 0, top: (hoveredNode.y ?? 0) - hoveredNode.r }}
          >
            {describeResponse(hoveredNode.record)}
          </div>
        )}
        {records.length === 0 && (
          <div className="empty-state">
            <p>No portraits yet — visit the laptop to submit yours!</p>
          </div>
        )}
        <button className="reset-btn" onClick={handleResetClick}>
          Reset wall
        </button>
      </div>
      <Legend count={records.length} />
    </div>
  );
}
