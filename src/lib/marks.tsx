import type { AffiliationShape, ArcDirection, ChronotypeIcon } from "../../shared/questions";

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
      // Both circles share one offset so they stay concentric — using two
      // independent jitter() calls here previously let them drift apart.
      const dx = jitter(4);
      const dy = jitter(4);
      return (
        <g>
          <circle cx={dx} cy={dy} r={r * 0.5} {...common} />
          <circle cx={dx} cy={dy} r={r * 0.3} {...common} strokeWidth={sw * 0.8} />
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

// Fixed so the two lines always sit in the same place/orientation on every
// portrait — only their color changes — making them easy to spot at a glance
// across the whole wall instead of hunting for them at a different angle
// on every node.
const CONTINENT_LINE_ANGLE = -18;

export function ContinentLines({ color, r }: { color: string; r: number }) {
  const len = r * 1.3;
  const gap = r * 0.16;
  const sw = Math.max(1.2, r * 0.06);
  return (
    <g transform={`rotate(${CONTINENT_LINE_ANGLE})`} stroke={color} strokeWidth={sw} strokeLinecap="round">
      <line x1={-len / 2} y1={-gap / 2} x2={len / 2} y2={-gap / 2} />
      <line x1={-len / 2} y1={gap / 2} x2={len / 2} y2={gap / 2} />
    </g>
  );
}

/** A small curve inset near the top of the circle: swoops up for "bright", down for "grim". */
export function TrendArc({ direction, r }: { direction: ArcDirection; r: number }) {
  const w = r * 0.4;
  const h = r * 0.2 * (direction === "up" ? -1 : 1);
  const y = -r * 0.68;
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

/**
 * Early bird / night owl, drawn using the portrait's own main circle rather
 * than a separate small icon: a ring of rays inset just inside the rim for
 * "sun", or a bold crescent inset within the circle for "moon".
 */
export function ChronotypeMark({ icon, r }: { icon: ChronotypeIcon; r: number }) {
  if (icon === "sun") {
    const sw = Math.max(1.2, r * 0.05);
    const rayCount = 10;
    const rays = Array.from({ length: rayCount }, (_, i) => {
      const a = (Math.PI * 2 * i) / rayCount;
      return (
        <line
          key={i}
          x1={Math.cos(a) * r * 0.82}
          y1={Math.sin(a) * r * 0.82}
          x2={Math.cos(a) * r * 0.96}
          y2={Math.sin(a) * r * 0.96}
        />
      );
    });
    return (
      <g stroke="#1a1a1a" strokeWidth={sw} strokeLinecap="round">
        {rays}
      </g>
    );
  }

  // Outer edge exactly r so it coincides with the portrait's own circle
  // boundary instead of floating as a visibly smaller, separate disc.
  return <path d={moonPathD(r)} fill="#003957" fillOpacity={0.9} fillRule="evenodd" />;
}

/**
 * Crescent moon as two full circles combined with evenodd fill: an outer
 * disc minus a smaller disc offset toward one side (fully contained within
 * it, so no stray sliver from the inner circle's own edge shows up). Inner
 * circle is close in size to the outer one and only slightly offset, which
 * keeps the resulting sliver thin rather than a fat half-moon.
 */
export function moonPathD(size: number): string {
  const R = size;
  const r2 = size * 0.85;
  const dx = size * 0.1; // dx + r2 < R keeps the inner circle fully inside the outer one
  const circle = (cx: number, radius: number) =>
    `M ${cx - radius} 0 A ${radius} ${radius} 0 1 0 ${cx + radius} 0 A ${radius} ${radius} 0 1 0 ${cx - radius} 0 Z`;
  return `${circle(0, R)} ${circle(dx, r2)}`;
}

/** A small cluster of dots inset in the circle, one per dining hall (count-coded, not color-coded). */
export function DiningDots({ count, r }: { count: number; r: number }) {
  const dotR = Math.max(1.2, r * 0.07);
  const spacing = r * 0.19;
  const cols = 3;
  const cx = r * 0.32;
  const cy = r * 0.42;
  return (
    <g fill="#1a1a1a">
      {Array.from({ length: count }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const rowCount = Math.min(cols, count - row * cols);
        const rowOffset = ((rowCount - 1) * spacing) / 2;
        return <circle key={i} cx={cx - rowOffset + col * spacing} cy={cy + row * spacing} r={dotR} />;
      })}
    </g>
  );
}
