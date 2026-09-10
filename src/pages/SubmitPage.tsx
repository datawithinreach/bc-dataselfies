import { useState } from "react";
import { nanoid } from "nanoid";
import type { ResponseInput, ResponseRecord } from "../../shared/questions";
import {
  affiliationOptions,
  schoolOptions,
  continentOptions,
  chronotypeOptions,
  rulesOptions,
  aiFutureOptions,
  diningHallOptions,
} from "../../shared/questions";
import PortraitMark from "../components/PortraitMark";
import PrintButton from "../components/PrintButton";
import { addResponse } from "../lib/storage";

type Draft = Partial<ResponseInput>;

const EMPTY: Draft = {};

const REQUIRED_FIELDS: (keyof ResponseInput)[] = [
  "name",
  "affiliation",
  "school",
  "continent",
  "chronotype",
  "rules",
  "aiFuture",
  "diningHall",
];

interface RadioQuestionProps<T extends { value: string; label: string }> {
  title: string;
  field: keyof ResponseInput;
  options: T[];
  draft: Draft;
  onChange: (field: keyof ResponseInput, value: string) => void;
}

function RadioQuestion<T extends { value: string; label: string }>({
  title,
  field,
  options,
  draft,
  onChange,
}: RadioQuestionProps<T>) {
  return (
    <fieldset className="question">
      <legend>{title}</legend>
      <div className="options">
        {options.map((opt) => (
          <label key={opt.value} className={`option ${draft[field] === opt.value ? "selected" : ""}`}>
            <input
              type="radio"
              name={String(field)}
              value={opt.value}
              checked={draft[field] === opt.value}
              onChange={() => onChange(field, opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function SubmitPage() {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<ResponseRecord | null>(null);

  const set = (field: keyof ResponseInput, value: string) => {
    setDraft((d) => ({ ...d, [field]: value }));
  };

  const requiredMissing = () => {
    return REQUIRED_FIELDS.some((f) => !draft[f] || String(draft[f]).trim().length === 0);
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (requiredMissing()) {
      setError("Please answer every question before submitting.");
      return;
    }
    setError(null);
    const record: ResponseRecord = {
      id: nanoid(10),
      name: draft.name!.trim(),
      affiliation: draft.affiliation!,
      school: draft.school!,
      continent: draft.continent!,
      chronotype: draft.chronotype!,
      rules: draft.rules!,
      aiFuture: draft.aiFuture!,
      diningHall: draft.diningHall!,
      createdAt: Date.now(),
    };
    addResponse(record);
    setSubmitted(record);
  }

  function startOver() {
    setDraft(EMPTY);
    setSubmitted(null);
    setError(null);
  }

  if (submitted) {
    return (
      <div className="page submit-page thankyou">
        <div className="thankyou-card">
          {/* Every mark now lives inside the main circle's radius, so this only
              needs a small margin — not the large padding earlier versions
              needed for marks drawn outside the boundary. */}
          <svg viewBox="-100 -100 200 200" width={220} height={220}>
            <PortraitMark record={submitted} r={90} />
          </svg>
          <h1>Thanks, {submitted.name.split(" ")[0]}!</h1>
          <p>Your data selfie just joined the wall — look for it on the big screen.</p>
          <div className="thankyou-actions">
            <button className="primary" onClick={startOver}>
              Make another
            </button>
            <PrintButton record={submitted} />
          </div>
          <p className="thankyou-instructions">
            Want to keep yours? Print it, cut it out, and snap it into a button pin. Then tap{" "}
            <strong>Make another</strong> to leave this ready for the next person.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page submit-page">
      <header className="submit-header">
        <div className="crest" />
        <div>
          <h1>BC Data Selfies</h1>
          <p>245 Beacon St. Open House &middot; Computer Science</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="form">
        <fieldset className="question">
          <legend>Your name</legend>
          <p className="hint">Just for us &mdash; your name won't be shown on the display.</p>
          <input
            className="text-input"
            type="text"
            maxLength={80}
            value={draft.name ?? ""}
            onChange={(e) => set("name", e.target.value)}
            placeholder="First & last name"
          />
        </fieldset>

        <RadioQuestion title="Which best describes you?" field="affiliation" options={affiliationOptions} draft={draft} onChange={set} />
        <RadioQuestion title="Your school / department" field="school" options={schoolOptions} draft={draft} onChange={set} />
        <RadioQuestion title="What continent are you from?" field="continent" options={continentOptions} draft={draft} onChange={set} />
        <RadioQuestion title="Early bird or night owl?" field="chronotype" options={chronotypeOptions} draft={draft} onChange={set} />
        <RadioQuestion title="When it comes to the rules, do you:" field="rules" options={rulesOptions} draft={draft} onChange={set} />
        <RadioQuestion title="AI's future is..." field="aiFuture" options={aiFutureOptions} draft={draft} onChange={set} />
        <RadioQuestion title="Your favorite dining hall is..." field="diningHall" options={diningHallOptions} draft={draft} onChange={set} />

        {error && <p className="error">{error}</p>}

        <button className="primary" type="submit">
          Submit & see my data selfie
        </button>
      </form>
    </div>
  );
}
