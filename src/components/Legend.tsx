import type { ReactNode } from "react";
import {
  affiliationOptions,
  schoolOptions,
  continentOptions,
  chronotypeOptions,
  rulesOptions,
  aiFutureOptions,
  diningHallOptions,
} from "../../shared/questions";
import { AffiliationMark } from "../lib/marks";
import {
  ContinentPreview,
  DotPreview,
  HalfFillPreview,
  TrendArcPreview,
  ChronotypeIconPreview,
  DiningStampPreview,
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

      <LegendGroup title="Bottom fill — school / dept.">
        {schoolOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <HalfFillPreview color={o.color} />
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

      <LegendGroup title="Icon, bottom-left — early bird or night owl">
        {chronotypeOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <ChronotypeIconPreview icon={o.icon} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Arc, top — AI's future">
        {aiFutureOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <TrendArcPreview direction={o.direction} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Dot — the rules">
        {rulesOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <DotPreview color={o.color} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Stamp, bottom-right — favorite dining hall">
        {diningHallOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <DiningStampPreview color={o.color} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>
    </aside>
  );
}
