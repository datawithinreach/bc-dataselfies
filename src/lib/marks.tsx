import type { AffiliationShape } from "../../shared/questions";

interface ShapeProps {
  shape: AffiliationShape;
  r: number;
  rng: () => number;
}

// Black-ink geometric marks for the "affiliation" channel, echoing the
// overlapping hand-drawn rectangles/triangles/hexagons of the TED reference.
export function AffiliationMark({ shape, r, rng }: ShapeProps) {
  const sw = Math.max(1.4, r * 0.07);
  const jitter = (spread: number) => (rng() - 0.5) * spread;
  const common = { fill: "none", stroke: "#1a1a1a", strokeWidth: sw, strokeLinejoin: "round" as const };

  switch (shape) {
    case "bars": {
      const barW = r * 0.16;
      const barH = r * 0.95;
      const xs = [-r * 0.36, 0, r * 0.36];
      return (
        <g>
          {xs.map((x, i) => (
            <rect
              key={i}
              x={x - barW / 2}
              y={-barH / 2}
              width={barW}
              height={barH}
              transform={`rotate(${jitter(10)} ${x} 0)`}
              {...common}
            />
          ))}
        </g>
      );
    }
    case "triangle": {
      const p1 = tri(r * 0.85, jitter(12));
      const p2 = tri(r * 0.5, jitter(12) + 20);
      return (
        <g>
          <polygon points={p1} {...common} />
          <polygon points={p2} {...common} strokeWidth={sw * 0.8} />
        </g>
      );
    }
    case "circle": {
      return (
        <g>
          <circle cx={jitter(4)} cy={jitter(4)} r={r * 0.5} {...common} />
          <circle cx={jitter(4)} cy={jitter(4)} r={r * 0.3} {...common} strokeWidth={sw * 0.8} />
        </g>
      );
    }
    case "diamond": {
      const s1 = r * 0.72;
      const s2 = r * 0.44;
      return (
        <g>
          <rect x={-s1 / 2} y={-s1 / 2} width={s1} height={s1} transform={`rotate(${45 + jitter(8)})`} {...common} />
          <rect
            x={-s2 / 2}
            y={-s2 / 2}
            width={s2}
            height={s2}
            transform={`rotate(${45 + jitter(8)})`}
            {...common}
            strokeWidth={sw * 0.8}
          />
        </g>
      );
    }
    case "hex": {
      return (
        <g>
          <polygon points={hex(r * 0.55, jitter(10))} {...common} />
          <polygon points={hex(r * 0.32, jitter(10) + 30)} {...common} strokeWidth={sw * 0.8} />
        </g>
      );
    }
  }
}

function tri(radius: number, rotateDeg: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 3; i++) {
    const angle = (Math.PI * 2 * i) / 3 - Math.PI / 2 + (rotateDeg * Math.PI) / 180;
    pts.push(`${(radius * Math.cos(angle)).toFixed(2)},${(radius * Math.sin(angle)).toFixed(2)}`);
  }
  return pts.join(" ");
}

function hex(radius: number, rotateDeg: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6 + (rotateDeg * Math.PI) / 180;
    pts.push(`${(radius * Math.cos(angle)).toFixed(2)},${(radius * Math.sin(angle)).toFixed(2)}`);
  }
  return pts.join(" ");
}

export function ContinentLines({ color, r, angle }: { color: string; r: number; angle: number }) {
  const len = r * 1.3;
  const gap = r * 0.16;
  const sw = Math.max(1.2, r * 0.06);
  return (
    <g transform={`rotate(${angle})`} stroke={color} strokeWidth={sw} strokeLinecap="round">
      <line x1={-len / 2} y1={-gap / 2} x2={len / 2} y2={-gap / 2} />
      <line x1={-len / 2} y1={gap / 2} x2={len / 2} y2={gap / 2} />
    </g>
  );
}

export function ChronotypeArc({ direction, r }: { direction: "up" | "down"; r: number }) {
  const w = r * 0.55;
  const h = r * 0.28 * (direction === "up" ? -1 : 1);
  const y = -r * 1.12;
  const sw = Math.max(1.2, r * 0.06);
  return (
    <path
      d={`M ${-w} ${y} Q 0 ${y + h} ${w} ${y}`}
      fill="none"
      stroke="#1a1a1a"
      strokeWidth={sw}
      strokeLinecap="round"
    />
  );
}

export function AiFutureTick({ direction, r }: { direction: "up" | "down"; r: number }) {
  const sw = Math.max(1.2, r * 0.07);
  const x = r * 0.78;
  const y = r * 0.9;
  const dy = direction === "up" ? -r * 0.32 : r * 0.32;
  return (
    <g stroke="#1a1a1a" strokeWidth={sw} strokeLinecap="round">
      <line x1={x} y1={y} x2={x + r * 0.22} y2={y + dy} />
      {direction === "up" && (
        <>
          <line x1={x + r * 0.22} y1={y + dy} x2={x + r * 0.36} y2={y + dy + r * 0.05} />
          <line x1={x + r * 0.22} y1={y + dy} x2={x + r * 0.3} y2={y + dy - r * 0.14} />
        </>
      )}
    </g>
  );
}

export function AnxietyDots({ count, r }: { count: number; r: number }) {
  const dotR = Math.max(1, r * 0.09);
  const startX = -r * 0.9;
  const y = r * 1.12;
  const spacing = r * 0.3;
  return (
    <g fill="#1a1a1a">
      {Array.from({ length: count }).map((_, i) => (
        <circle key={i} cx={startX + i * spacing} cy={y} r={dotR} />
      ))}
    </g>
  );
}
