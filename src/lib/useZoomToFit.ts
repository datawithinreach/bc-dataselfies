import { useEffect, useRef, useState } from "react";
import type { SimNode } from "./useForceLayout";

export interface ZoomTransform {
  scale: number;
  tx: number;
  ty: number;
}

const IDENTITY: ZoomTransform = { scale: 1, tx: 0, ty: 0 };
const EASE = 0.08;

function computeTarget(nodes: SimNode[], width: number, height: number, padding: number): ZoomTransform {
  if (width === 0 || height === 0 || nodes.length === 0) return IDENTITY;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const n of nodes) {
    const x = n.x ?? 0;
    const y = n.y ?? 0;
    minX = Math.min(minX, x - n.r);
    maxX = Math.max(maxX, x + n.r);
    minY = Math.min(minY, y - n.r);
    maxY = Math.max(maxY, y + n.r);
  }
  const boxW = Math.max(1, maxX - minX);
  const boxH = Math.max(1, maxY - minY);
  // Capped at 1 so a small handful of nodes render at their natural size
  // instead of being blown up to fill the canvas.
  const scale = Math.min(1, (width - padding * 2) / boxW, (height - padding * 2) / boxH);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return { scale, tx: width / 2 - cx * scale, ty: height / 2 - cy * scale };
}

/**
 * Continuously eases the wall's pan/zoom toward whatever transform keeps
 * every node's world-space bounding box inside the canvas. Runs its own rAF
 * loop rather than piggybacking on simulation ticks, so it keeps easing
 * smoothly even after the force sim settles and stops re-rendering.
 */
export function useZoomToFit(nodes: SimNode[], width: number, height: number, padding = 60): ZoomTransform {
  const [transform, setTransform] = useState<ZoomTransform>(IDENTITY);
  const targetRef = useRef<ZoomTransform>(IDENTITY);
  const currentRef = useRef<ZoomTransform>(IDENTITY);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    targetRef.current = computeTarget(nodes, width, height, padding);

    if (rafRef.current != null) return;
    const step = () => {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      const next: ZoomTransform = {
        scale: cur.scale + (tgt.scale - cur.scale) * EASE,
        tx: cur.tx + (tgt.tx - cur.tx) * EASE,
        ty: cur.ty + (tgt.ty - cur.ty) * EASE,
      };
      currentRef.current = next;
      setTransform(next);
      const settled =
        Math.abs(tgt.scale - next.scale) < 0.001 &&
        Math.abs(tgt.tx - next.tx) < 0.5 &&
        Math.abs(tgt.ty - next.ty) < 0.5;
      rafRef.current = settled ? null : requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [nodes, width, height, padding]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return transform;
}
