import type { ReactNode } from "react";
import type { ArcDirection, ChronotypeIcon } from "../../shared/questions";
import { moonPathD, CHRONOTYPE_COLOR, CHRONOTYPE_OPACITY } from "../lib/marks";

// Mini renders of each visual channel, built at a legible scale of their own —
// so the legend shows what the channel really looks like on a portrait,
// not just an abstract color swatch. (The wall's marks are tuned to read at
// 26px radius; blindly re-scaling them down to icon size makes lines/arcs/
// ticks vanish, so several are redrawn here with fixed, bolder proportions.)

const R = 16;
const PAD = 16;
const SIZE = (R + PAD) * 2;

function PreviewFrame({ children }: { children: ReactNode }) {
  return (
    <svg width={40} height={40} viewBox={`${-(R + PAD)} ${-(R + PAD)} ${SIZE} ${SIZE}`}>
      {children}
    </svg>
  );
}

const NEUTRAL_FILL = "#e6e0d2";
const NEUTRAL_STROKE = "#c9bfa8";

function BaseCircle() {
  return <circle r={R} fill={NEUTRAL_FILL} stroke={NEUTRAL_STROKE} strokeWidth={1} />;
}

export function ContinentPreview({ color }: { color: string }) {
  const len = R * 1.5;
  const gap = 6;
  return (
    <PreviewFrame>
      <BaseCircle />
      <g stroke={color} strokeWidth={2.6} strokeLinecap="round">
        <line x1={-len / 2} y1={-gap / 2} x2={len / 2} y2={-gap / 2} />
        <line x1={-len / 2} y1={gap / 2} x2={len / 2} y2={gap / 2} />
      </g>
    </PreviewFrame>
  );
}

/** Single colored dot — used for the "rules" channel. */
export function DotPreview({ color }: { color: string }) {
  return (
    <PreviewFrame>
      <BaseCircle />
      <circle cx={-R * 0.5} cy={-R * 0.4} r={4} fill={color} />
    </PreviewFrame>
  );
}

/** Colored bottom half-fill — used for the "school / dept." channel. */
export function HalfFillPreview({ color }: { color: string }) {
  return (
    <PreviewFrame>
      <BaseCircle />
      <path d={`M ${-R} 0 A ${R} ${R} 0 0 0 ${R} 0 Z`} fill={color} opacity={0.6} />
    </PreviewFrame>
  );
}

/** Small curve, swoops up or down — used for "AI's future". */
export function TrendArcPreview({ direction }: { direction: ArcDirection }) {
  const w = R * 0.85;
  const h = (direction === "up" ? -1 : 1) * R * 0.55;
  return (
    <PreviewFrame>
      <BaseCircle />
      <path d={`M ${-w} 0 Q 0 ${h} ${w} 0`} fill="none" stroke="#1a1a1a" strokeWidth={2.4} strokeLinecap="round" />
    </PreviewFrame>
  );
}

/**
 * Sun (ring of inset rays) or crescent moon (inset in the circle itself) —
 * used for "early bird / night owl". Mirrors ChronotypeMark in lib/marks.tsx,
 * which uses the portrait's own main circle rather than a separate icon.
 */
export function ChronotypeIconPreview({ icon }: { icon: ChronotypeIcon }) {
  if (icon === "sun") {
    const rayCount = 10;
    const rays = Array.from({ length: rayCount }, (_, i) => {
      const a = (Math.PI * 2 * i) / rayCount;
      return (
        <line
          key={i}
          x1={Math.cos(a) * R * 0.78}
          y1={Math.sin(a) * R * 0.78}
          x2={Math.cos(a) * R * 0.95}
          y2={Math.sin(a) * R * 0.95}
        />
      );
    });
    return (
      <PreviewFrame>
        <BaseCircle />
        <g stroke={CHRONOTYPE_COLOR} strokeOpacity={CHRONOTYPE_OPACITY} strokeWidth={1.8} strokeLinecap="round">
          {rays}
        </g>
      </PreviewFrame>
    );
  }

  return (
    <PreviewFrame>
      <BaseCircle />
      <path d={moonPathD(R)} fill={CHRONOTYPE_COLOR} fillOpacity={CHRONOTYPE_OPACITY} fillRule="evenodd" />
    </PreviewFrame>
  );
}

/** Cluster of black dots (count-coded) — used for "favorite dining hall". */
export function DiningDotsPreview({ count }: { count: number }) {
  const dotR = 2.2;
  const spacing = R * 0.4;
  const cols = 3;
  const cx = R * 0.1;
  const cy = R * 0.15;
  return (
    <PreviewFrame>
      <BaseCircle />
      <g fill="#1a1a1a">
        {Array.from({ length: count }).map((_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const rowCount = Math.min(cols, count - row * cols);
          const rowOffset = ((rowCount - 1) * spacing) / 2;
          return <circle key={i} cx={cx - rowOffset + col * spacing} cy={cy + row * spacing} r={dotR} />;
        })}
      </g>
    </PreviewFrame>
  );
}
