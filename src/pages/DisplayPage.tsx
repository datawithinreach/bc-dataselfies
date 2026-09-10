import { useEffect, useRef, useState } from "react";
import { describeResponse, type ClusterField } from "../../shared/questions";
import { useResponses } from "../lib/useResponses";
import { useForceLayout } from "../lib/useForceLayout";
import { useZoomToFit } from "../lib/useZoomToFit";
import { resetResponses } from "../lib/storage";
import PortraitMark from "../components/PortraitMark";
import PrintButton from "../components/PrintButton";
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
  const [clusterBy, setClusterBy] = useState<ClusterField>("school");
  const nodes = useForceLayout(records, clusterBy);
  const { scale, tx, ty } = useZoomToFit(nodes, width, height);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const hoveredNode = hoveredId ? nodes.find((n) => n.id === hoveredId) : undefined;
  const selectedNode = selectedId ? nodes.find((n) => n.id === selectedId) : undefined;
  // A selected node's panel takes over the spot the hover tooltip would
  // otherwise use — showing both at once for the same node would just
  // double up the same info.
  const tooltipNode = selectedId ? undefined : hoveredNode;

  // Nodes live in the force sim's world space; both the tooltip and the
  // selected-node panel are plain HTML elements, so their screen position
  // has to go through the same zoom-to-fit transform the <g> below applies
  // to the SVG contents.
  function screenPos(node: { x?: number; y?: number; r: number }) {
    return { left: tx + (node.x ?? 0) * scale, top: ty + ((node.y ?? 0) - node.r) * scale };
  }

  return (
    <div className="page display-page">
      <div className="canvas" ref={canvasRef} onClick={() => setSelectedId(null)}>
        <svg width={width} height={height}>
          <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
            {nodes.map((n) => (
              <PortraitMark
                key={n.id}
                record={n.record}
                x={n.x ?? 0}
                y={n.y ?? 0}
                r={n.r}
                onHoverChange={(hovering) => setHoveredId(hovering ? n.id : null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId((id) => (id === n.id ? null : n.id));
                }}
              />
            ))}
          </g>
        </svg>
        {tooltipNode && (
          <div className="node-tooltip" style={screenPos(tooltipNode)}>
            <div className="tooltip-name">{tooltipNode.record.name}</div>
            {describeResponse(tooltipNode.record)}
          </div>
        )}
        {selectedNode && (
          <div
            className="node-tooltip node-tooltip-selected"
            style={screenPos(selectedNode)}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="tooltip-close" onClick={() => setSelectedId(null)} aria-label="Close">
              &times;
            </button>
            <div className="tooltip-name">{selectedNode.record.name}</div>
            {describeResponse(selectedNode.record)}
            <div className="tooltip-print">
              <PrintButton record={selectedNode.record} />
            </div>
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
      <Legend count={records.length} clusterBy={clusterBy} onClusterByChange={setClusterBy} />
    </div>
  );
}
