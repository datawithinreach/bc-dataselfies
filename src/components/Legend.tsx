import type { ReactNode } from "react";
import {
  affiliationOptions,
  schoolOptions,
  continentOptions,
  chronotypeOptions,
  bestIdeasOptions,
  rulesOptions,
  emailAnxietyOptions,
  aiFutureOptions,
} from "../../shared/questions";
import { AffiliationMark } from "../lib/marks";
import {
  SchoolPreview,
  ContinentPreview,
  BestIdeasPreview,
  RulesPreview,
  ChronotypePreview,
  AiFuturePreview,
  AnxietyPreview,
} from "./LegendPreview";

function MiniShape({ shape }: { shape: (typeof affiliationOptions)[number]["shape"] }) {
  return (
    <svg width={38} height={38} viewBox="-19 -19 38 38">
      <AffiliationMark shape={shape} r={13} rng={() => 0.5} />
    </svg>
  );
}

function LegendGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="legend-group">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default function Legend({ count }: { count: number }) {
  return (
    <aside className="legend">
      <div className="legend-title">
        <h2>BC Data Selfies</h2>
        <p>{count} portraits so far</p>
      </div>

      <LegendGroup title="Shape — who are you?">
        {affiliationOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <MiniShape shape={o.shape} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Background wash — school / dept.">
        {schoolOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <SchoolPreview color={o.color} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Parallel lines — continent">
        {continentOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <ContinentPreview color={o.color} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Dot — best ideas strike...">
        {bestIdeasOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <BestIdeasPreview color={o.color} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Bottom fill — the rules">
        {rulesOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <RulesPreview color={o.color} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Arc, top — chronotype">
        {chronotypeOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <ChronotypePreview direction={o.direction} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Tick, bottom-right — AI's future">
        {aiFutureOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <AiFuturePreview direction={o.direction} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Dots, right — unread-email anxiety">
        {emailAnxietyOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <AnxietyPreview count={o.dots} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>
    </aside>
  );
}
