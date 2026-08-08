import type { ResponseRecord } from "../../shared/questions";
import {
  affiliationOptions,
  schoolOptions,
  continentOptions,
  chronotypeOptions,
  bestIdeasOptions,
  rulesOptions,
  emailAnxietyOptions,
  aiFutureOptions,
  findOption,
} from "../../shared/questions";
import { makeRng } from "../lib/hash";
import { AffiliationMark, ContinentLines, ChronotypeArc, AiFutureTick, AnxietyDots } from "../lib/marks";

const CONTINENT_ANGLES: Record<string, number> = {
  na: -20,
  sa: 15,
  eu: 45,
  af: -55,
  as: 70,
  oc: -80,
};

export interface PortraitMarkProps {
  record: ResponseRecord;
  x?: number;
  y?: number;
  r: number;
  onClick?: () => void;
}

export default function PortraitMark({ record, x = 0, y = 0, r, onClick }: PortraitMarkProps) {
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
  const bestIdeas = findOption(bestIdeasOptions, record.bestIdeas);
  const rules = findOption(rulesOptions, record.rules);
  const anxiety = findOption(emailAnxietyOptions, record.emailAnxiety);
  const aiFuture = findOption(aiFutureOptions, record.aiFuture);

  const angle = CONTINENT_ANGLES[continent.value] ?? 0;

  return (
    <g transform={`translate(${x} ${y})`} onClick={onClick} style={{ cursor: onClick ? "pointer" : undefined }}>
      {/* school wash */}
      <circle r={r} fill={school.color} opacity={0.22} />
      {/* rules half-fill, bottom half */}
      <path
        d={`M ${-r} 0 A ${r} ${r} 0 0 0 ${r} 0 Z`}
        fill={rules.color}
        opacity={0.4}
      />
      <circle r={r} fill="none" stroke={school.color} strokeOpacity={0.7} strokeWidth={Math.max(1, r * 0.035)} />

      <ContinentLines color={continent.color} r={r} angle={angle} />
      <AffiliationMark shape={affiliation.shape} r={r} rng={rng} />

      {/* best-ideas dot */}
      <circle cx={-r * 0.62} cy={-r * 0.5} r={Math.max(2, r * 0.16)} fill={bestIdeas.color} />

      <ChronotypeArc direction={chronotype.direction} r={r} />
      <AiFutureTick direction={aiFuture.direction} r={r} />
      <AnxietyDots count={anxiety.dots} r={r} />
    </g>
  );
}
