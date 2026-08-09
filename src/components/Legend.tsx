import type { ReactNode } from "react";
import {
  affiliationOptions,
  schoolOptions,
  continentOptions,
  chronotypeOptions,
  rulesOptions,
  aiFutureOptions,
  diningHallOptions,
  type ClusterField,
} from "../../shared/questions";
import { AffiliationMark } from "../lib/marks";
import {
  ContinentPreview,
  DotPreview,
  HalfFillPreview,
  TrendArcPreview,
  ChronotypeIconPreview,
  DiningDotsPreview,
} from "./LegendPreview";
import DataControls from "./DataControls";

function MiniShape({ shape }: { shape: (typeof affiliationOptions)[number]["shape"] }) {
  return (
    <svg width={38} height={38} viewBox="-19 -19 38 38">
      <AffiliationMark shape={shape} r={13} rng={() => 0.5} />
    </svg>
  );
}

function LegendGroup({
  title,
  field,
  activeField,
  onSelect,
  children,
}: {
  title: string;
  field: ClusterField;
  activeField: ClusterField;
  onSelect: (field: ClusterField) => void;
  children: ReactNode;
}) {
  const active = field === activeField;
  return (
    <div className="legend-group">
      <h3
        className={active ? "clusterable active" : "clusterable"}
        role="button"
        tabIndex={0}
        onClick={() => onSelect(field)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelect(field);
        }}
      >
        {title}
        {active && <span className="cluster-badge">clustering</span>}
      </h3>
      {children}
    </div>
  );
}

export default function Legend({
  count,
  clusterBy,
  onClusterByChange,
}: {
  count: number;
  clusterBy: ClusterField;
  onClusterByChange: (field: ClusterField) => void;
}) {
  return (
    <aside className="legend">
      <div className="legend-title">
        <h2>BC Data Selfies</h2>
        <p>{count} portraits so far</p>
        <p className="legend-hint">Click a section below to cluster the wall by it.</p>
      </div>

      <LegendGroup title="Shape — who are you?" field="affiliation" activeField={clusterBy} onSelect={onClusterByChange}>
        {affiliationOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <MiniShape shape={o.shape} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Bottom fill — school / dept." field="school" activeField={clusterBy} onSelect={onClusterByChange}>
        {schoolOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <HalfFillPreview color={o.color} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Parallel lines — continent" field="continent" activeField={clusterBy} onSelect={onClusterByChange}>
        {continentOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <ContinentPreview color={o.color} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup
        title="Sun rays / moon — early bird or night owl"
        field="chronotype"
        activeField={clusterBy}
        onSelect={onClusterByChange}
      >
        {chronotypeOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <ChronotypeIconPreview icon={o.icon} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Arc, inset near top — AI's future" field="aiFuture" activeField={clusterBy} onSelect={onClusterByChange}>
        {aiFutureOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <TrendArcPreview direction={o.direction} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup title="Dot — the rules" field="rules" activeField={clusterBy} onSelect={onClusterByChange}>
        {rulesOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <DotPreview color={o.color} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <LegendGroup
        title="Dots (count) — favorite dining hall"
        field="diningHall"
        activeField={clusterBy}
        onSelect={onClusterByChange}
      >
        {diningHallOptions.map((o) => (
          <div className="legend-row" key={o.value}>
            <DiningDotsPreview count={o.dots} />
            <span>{o.label}</span>
          </div>
        ))}
      </LegendGroup>

      <DataControls />
    </aside>
  );
}
