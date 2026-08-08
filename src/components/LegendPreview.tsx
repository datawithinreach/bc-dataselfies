import type { ReactNode } from "react";
import type { ArcDirection, ChronotypeIcon } from "../../shared/questions";
import { moonPathD } from "../lib/marks";

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

/** Sun or crescent moon icon — used for "early bird / night owl". */
export function ChronotypeIconPreview({ icon }: { icon: ChronotypeIcon }) {
  const size = R * 0.45;
  const sw = 2.2;

  if (icon === "sun") {
    const rays = Array.from({ length: 8 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 8;
      return (
        <line
          key={i}
          x1={Math.cos(a) * size * 1.45}
          y1={Math.sin(a) * size * 1.45}
          x2={Math.cos(a) * size * 2.05}
          y2={Math.sin(a) * size * 2.05}
        />
      );
    });
    return (
      <PreviewFrame>
        <BaseCircle />
        <g stroke="#1a1a1a" strokeWidth={sw} strokeLinecap="round">
          <circle r={size} fill="none" />
          {rays}
        </g>
      </PreviewFrame>
    );
  }

  return (
    <PreviewFrame>
      <BaseCircle />
      <path d={moonPathD(size)} fill="#1a1a1a" fillRule="evenodd" />
    </PreviewFrame>
  );
}

/** Colored diamond "stamp" — used for "favorite dining hall". */
export function DiningStampPreview({ color }: { color: string }) {
  const size = R * 0.7;
  return (
    <PreviewFrame>
      <BaseCircle />
      <rect
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        fill={color}
        stroke="#1a1a1a"
        strokeWidth={1.4}
        transform="rotate(45)"
      />
    </PreviewFrame>
  );
}
