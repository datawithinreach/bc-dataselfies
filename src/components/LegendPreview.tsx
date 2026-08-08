import type { ReactNode } from "react";
import type { ArcDirection } from "../../shared/questions";

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

export function SchoolPreview({ color }: { color: string }) {
  return (
    <PreviewFrame>
      <circle r={R} fill={color} opacity={0.28} />
      <circle r={R} fill="none" stroke={color} strokeOpacity={0.8} strokeWidth={1.4} />
    </PreviewFrame>
  );
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

export function BestIdeasPreview({ color }: { color: string }) {
  return (
    <PreviewFrame>
      <BaseCircle />
      <circle cx={-R * 0.5} cy={-R * 0.4} r={4} fill={color} />
    </PreviewFrame>
  );
}

export function RulesPreview({ color }: { color: string }) {
  return (
    <PreviewFrame>
      <BaseCircle />
      <path d={`M ${-R} 0 A ${R} ${R} 0 0 0 ${R} 0 Z`} fill={color} opacity={0.6} />
    </PreviewFrame>
  );
}

export function ChronotypePreview({ direction }: { direction: ArcDirection }) {
  const w = R * 0.85;
  const h = (direction === "up" ? -1 : 1) * R * 0.55;
  return (
    <PreviewFrame>
      <BaseCircle />
      <path d={`M ${-w} 0 Q 0 ${h} ${w} 0`} fill="none" stroke="#1a1a1a" strokeWidth={2.4} strokeLinecap="round" />
    </PreviewFrame>
  );
}

export function AiFuturePreview({ direction }: { direction: ArcDirection }) {
  const dy = direction === "up" ? -R * 0.7 : R * 0.7;
  return (
    <PreviewFrame>
      <BaseCircle />
      <g stroke="#1a1a1a" strokeWidth={2.4} strokeLinecap="round">
        <line x1={-R * 0.4} y1={0} x2={R * 0.4} y2={dy} />
        {direction === "up" && (
          <>
            <line x1={R * 0.4} y1={dy} x2={R * 0.62} y2={dy + 3} />
            <line x1={R * 0.4} y1={dy} x2={R * 0.52} y2={dy + 9} />
          </>
        )}
      </g>
    </PreviewFrame>
  );
}

export function AnxietyPreview({ count }: { count: number }) {
  const spacing = 8;
  const startX = (-(count - 1) * spacing) / 2;
  return (
    <PreviewFrame>
      <BaseCircle />
      <g fill="#1a1a1a">
        {Array.from({ length: count }).map((_, i) => (
          <circle key={i} cx={startX + i * spacing} cy={R * 0.7} r={2.6} />
        ))}
      </g>
    </PreviewFrame>
  );
}
