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

function MiniShape({ shape }: { shape: (typeof affiliationOptions)[number]["shape"] }) {
  return (
    <svg width={26} height={26} viewBox="-15 -15 30 30">
      <AffiliationMark shape={shape} r={11} rng={() => 0.5} />
    </svg>
  );
}

function Swatch({ color }: { color: string }) {
  return <span className="legend-swatch" style={{ background: color }} />;
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
            <Swatch color={o.color} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Parallel lines — continent">
        {continentOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <Swatch color={o.color} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Dot — best ideas strike...">
        {bestIdeasOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <Swatch color={o.color} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Bottom fill — the rules">
        {rulesOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <Swatch color={o.color} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Arc, top — chronotype">
        {chronotypeOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <span className="legend-glyph">{o.direction === "up" ? "⌢" : "⌣"}</span>
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Tick, bottom-right — AI's future">
        {aiFutureOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <span className="legend-glyph">{o.direction === "up" ? "↗" : "↘"}</span>
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Dots, right — unread-email anxiety">
        {emailAnxietyOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <span className="legend-glyph">{"•".repeat(o.dots)}</span>
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>
    </aside>
  );
}
