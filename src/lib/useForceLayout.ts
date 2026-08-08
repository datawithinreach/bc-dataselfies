import { useEffect, useRef, useState } from "react";
import {
  forceSimulation,
  forceManyBody,
  forceCollide,
  forceX,
  forceY,
  forceCenter,
  type SimulationNodeDatum,
} from "d3-force";
import type { ResponseRecord } from "../../shared/questions";
import { schoolOptions } from "../../shared/questions";

export interface SimNode extends SimulationNodeDatum {
  id: string;
  record: ResponseRecord;
  r: number;
}

const NODE_R = 26;

function clusterCenters(width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const layoutR = Math.min(width, height) * 0.32;
  const centers = new Map<string, { x: number; y: number }>();
  schoolOptions.forEach((school, i) => {
    const angle = (Math.PI * 2 * i) / schoolOptions.length - Math.PI / 2;
    centers.set(school.value, {
      x: cx + layoutR * Math.cos(angle),
      y: cy + layoutR * Math.sin(angle),
    });
  });
  return centers;
}

export function useForceLayout(records: ResponseRecord[], width: number, height: number) {
  const [nodes, setNodes] = useState<SimNode[]>([]);
  const nodesRef = useRef<Map<string, SimNode>>(new Map());
  const simRef = useRef<ReturnType<typeof forceSimulation<SimNode>> | null>(null);

  useEffect(() => {
    if (width === 0 || height === 0) return;
    const centers = clusterCenters(width, height);
    const map = nodesRef.current;

    for (const record of records) {
      if (!map.has(record.id)) {
        const center = centers.get(record.school) ?? { x: width / 2, y: height / 2 };
        map.set(record.id, {
          id: record.id,
          record,
          r: NODE_R,
          x: center.x + (Math.random() - 0.5) * 40,
          y: center.y + (Math.random() - 0.5) * 40,
        });
      }
    }
    // Drop nodes for records that were cleared (e.g. after a reset).
    const validIds = new Set(records.map((r) => r.id));
    for (const id of Array.from(map.keys())) {
      if (!validIds.has(id)) map.delete(id);
    }

    const currentNodes = Array.from(map.values());

    if (!simRef.current) {
      simRef.current = forceSimulation<SimNode>(currentNodes)
        .force("charge", forceManyBody().strength(-40))
        .force("collide", forceCollide<SimNode>((d) => d.r + 6))
        .force(
          "x",
          forceX<SimNode>((d) => centers.get(d.record.school)?.x ?? width / 2).strength(0.08),
        )
        .force(
          "y",
          forceY<SimNode>((d) => centers.get(d.record.school)?.y ?? height / 2).strength(0.08),
        )
        .force("center", forceCenter(width / 2, height / 2).strength(0.02))
        .alphaDecay(0.02)
        .on("tick", () => setNodes([...map.values()]));
    } else {
      simRef.current.nodes(currentNodes);
    }
    simRef.current.alpha(Math.max(simRef.current.alpha(), 0.5)).restart();

    setNodes(currentNodes);
  }, [records, width, height]);

  useEffect(() => {
    return () => {
      simRef.current?.stop();
    };
  }, []);

  return nodes;
}
