import type { ResponseRecord } from "../../shared/questions";
import {
  affiliationOptions,
  schoolOptions,
  continentOptions,
  chronotypeOptions,
  rulesOptions,
  aiFutureOptions,
  diningHallOptions,
  findOption,
} from "../../shared/questions";
import { makeRng } from "../lib/hash";
import { AffiliationMark, ContinentLines, TrendArc, ChronotypeMark, DiningDots } from "../lib/marks";

// The affiliation shape is drawn a bit smaller than the full radius so it
// doesn't crowd the continent lines, which now sit at a fixed angle/position
// on every portrait (rather than rotating per-continent) and need to stay
// findable without the shape constantly overlapping them.
const AFFILIATION_SCALE = 0.72;

export interface PortraitMarkProps {
  record: ResponseRecord;
  x?: number;
  y?: number;
  r: number;
  onClick?: () => void;
  onHoverChange?: (hovering: boolean) => void;
}

export default function PortraitMark({ record, x = 0, y = 0, r, onClick, onHoverChange }: PortraitMarkProps) {
  // Not memoized on purpose: makeRng() is pure, so a fresh generator seeded
  // from the same id always replays the same sequence of values. Reusing one
  // generator instance across re-renders (e.g. via useMemo) would let each
  // force-simulation tick advance it further, making the shape's jitter
  // silently change every frame instead of staying fixed per person.
  const rng = makeRng(record.id);

  const affiliation = findOption(affiliationOptions, record.affiliation);
  const school = findOption(schoolOptions, record.school);
  const continent = findOption(continentOptions, record.continent);
  const chronotype = findOption(chronotypeOptions, record.chronotype);
  const rules = findOption(rulesOptions, record.rules);
  const aiFuture = findOption(aiFutureOptions, record.aiFuture);
  const diningHall = findOption(diningHallOptions, record.diningHall);

  return (
    <g
      transform={`translate(${x} ${y})`}
      onClick={onClick}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      {/* neutral base */}
      <circle r={r} fill="#e6e0d2" />
      {/* school / dept, bottom half-fill */}
      <path d={`M ${-r} 0 A ${r} ${r} 0 0 0 ${r} 0 Z`} fill={school.color} opacity={0.6} />
      <circle r={r} fill="none" stroke="#c9bfa8" strokeWidth={Math.max(1, r * 0.035)} />

      {/* early bird / night owl, drawn early so the shape/lines/dot below stay on top of it */}
      <ChronotypeMark icon={chronotype.icon} r={r} />

      <ContinentLines color={continent.color} r={r} />
      <AffiliationMark shape={affiliation.shape} r={r * AFFILIATION_SCALE} rng={rng} />

      {/* rules, single colored dot */}
      <circle cx={-r * 0.62} cy={-r * 0.5} r={Math.max(2, r * 0.16)} fill={rules.color} />

      <TrendArc direction={aiFuture.direction} r={r} />
      <DiningDots count={diningHall.dots} r={r} />
    </g>
  );
}
