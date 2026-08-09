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
import type { ClusterField, Option, ResponseRecord } from "../../shared/questions";
import { clusterableFields } from "../../shared/questions";

export interface SimNode extends SimulationNodeDatum {
  id: string;
  record: ResponseRecord;
  r: number;
}

const NODE_R = 26;

// Cluster centers live in a fixed "world" space, not canvas pixels — the
// wall's own zoom-to-fit transform (useZoomToFit) maps this into whatever
// the canvas size actually is. That split is what lets the ring grow with
// the data instead of being squeezed to fit a fixed viewport up front.
function clusterCenters(counts: Map<string, number>, options: Option[]) {
  // Per-option "footprint" radius: roughly the radius of a hex-packed
  // circle holding that many nodes, so a bigger group claims a bigger
  // slice of the ring instead of every option getting equal space.
  const footprints = options.map((o) => {
    const count = counts.get(o.value) ?? 0;
    return Math.max(NODE_R * 1.6, NODE_R * 1.15 * Math.sqrt(Math.max(count, 1)));
  });
  const totalFootprint = footprints.reduce((a, b) => a + b, 0);
  // Ring radius chosen so neighboring cluster footprints are roughly
  // tangent to each other — circumference ~= sum of cluster diameters —
  // which is what pulls the clusters snugly into one big circle instead of
  // leaving gaps between them.
  const ringR = Math.max(totalFootprint / Math.PI, NODE_R * 3);

  const centers = new Map<string, { x: number; y: number }>();
  let angle = -Math.PI / 2;
  options.forEach((o, i) => {
    const share = (footprints[i] / totalFootprint) * Math.PI * 2;
    const mid = angle + share / 2;
    centers.set(o.value, { x: ringR * Math.cos(mid), y: ringR * Math.sin(mid) });
    angle += share;
  });
  return centers;
}

export function useForceLayout(records: ResponseRecord[], clusterBy: ClusterField) {
  const [nodes, setNodes] = useState<SimNode[]>([]);
  const nodesRef = useRef<Map<string, SimNode>>(new Map());
  const simRef = useRef<ReturnType<typeof forceSimulation<SimNode>> | null>(null);
  // Read live by the x/y force accessors on every tick, so retargeting
  // (new data, or the user picking a different cluster field) just means
  // updating this ref rather than recreating the simulation.
  const centersRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const centerForceRef = useRef<ReturnType<typeof forceCenter<SimNode>> | null>(null);

  useEffect(() => {
    const fieldOptions = clusterableFields.find((f) => f.field === clusterBy)?.options ?? [];
    const counts = new Map<string, number>();
    for (const record of records) {
      const value = record[clusterBy];
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    centersRef.current = clusterCenters(counts, fieldOptions);
    const map = nodesRef.current;

    for (const record of records) {
      if (!map.has(record.id)) {
        const center = centersRef.current.get(record[clusterBy]) ?? { x: 0, y: 0 };
        map.set(record.id, {
          id: record.id,
          record,
          r: NODE_R,
          x: center.x + (Math.random() - 0.5) * 40,
          y: center.y + (Math.random() - 0.5) * 40,
        });
      } else {
        // The record object itself may have changed shape (e.g. an
        // import), so keep it fresh even though the sim node persists.
        map.get(record.id)!.record = record;
      }
    }
    // Drop nodes for records that were cleared (e.g. after a reset).
    const validIds = new Set(records.map((r) => r.id));
    for (const id of Array.from(map.keys())) {
      if (!validIds.has(id)) map.delete(id);
    }

    const currentNodes = Array.from(map.values());

    if (!simRef.current) {
      const centerForce = forceCenter<SimNode>(0, 0).strength(0.02);
      centerForceRef.current = centerForce;
      simRef.current = forceSimulation<SimNode>(currentNodes)
        .force("charge", forceManyBody().strength(-6))
        .force("collide", forceCollide<SimNode>((d) => d.r + 4).iterations(2))
        .force("center", centerForce)
        .alphaDecay(0.02);
    } else {
      simRef.current.nodes(currentNodes);
      centerForceRef.current?.x(0).y(0);
    }

    // Rebound every run (not just on creation) so a cluster-field change
    // retargets existing nodes instead of leaving the accessor pinned to
    // whichever field was active when the simulation was first built.
    simRef.current
      .force(
        "x",
        forceX<SimNode>((d) => centersRef.current.get(d.record[clusterBy])?.x ?? 0).strength(0.15),
      )
      .force(
        "y",
        forceY<SimNode>((d) => centersRef.current.get(d.record[clusterBy])?.y ?? 0).strength(0.15),
      )
      .on("tick", () => setNodes([...map.values()]));

    simRef.current.alpha(Math.max(simRef.current.alpha(), 0.6)).restart();
    setNodes(currentNodes);
  }, [records, clusterBy]);

  useEffect(() => {
    return () => {
      simRef.current?.stop();
    };
  }, []);

  return nodes;
}
