import { useState } from "react";
import type { ResponseInput, ResponseRecord } from "../../shared/questions";
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
import PortraitMark from "../components/PortraitMark";

type Draft = Partial<ResponseInput>;

const EMPTY: Draft = {};

interface RadioQuestionProps<T extends { value: string; label: string; color?: string }> {
  title: string;
  field: keyof ResponseInput;
  options: T[];
  draft: Draft;
  onChange: (field: keyof ResponseInput, value: string) => void;
}

function RadioQuestion<T extends { value: string; label: string; color?: string }>({
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
            {opt.color && <span className="swatch" style={{ background: opt.color }} />}
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function SubmitPage() {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<ResponseRecord | null>(null);

  const set = (field: keyof ResponseInput, value: string) => {
    setDraft((d) => ({ ...d, [field]: value }));
  };

  const requiredMissing = () => {
    const fields: (keyof ResponseInput)[] = [
      "name",
      "affiliation",
      "school",
      "continent",
      "chronotype",
      "bestIdeas",
      "rules",
      "emailAnxiety",
      "aiFuture",
    ];
    return fields.some((f) => !draft[f] || String(draft[f]).trim().length === 0);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (requiredMissing()) {
      setError("Please answer every question before submitting.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong");
      }
      const record: ResponseRecord = await res.json();
      setSubmitted(record);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
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
          <svg viewBox="-100 -100 200 200" width={220} height={220}>
            <PortraitMark record={submitted} r={90} />
          </svg>
          <h1>Thanks, {submitted.name.split(" ")[0]}!</h1>
          <p>Your data selfie just joined the wall — look for it on the big screen.</p>
          <button className="primary" onClick={startOver}>
            Make another
          </button>
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
        <RadioQuestion title="When do you get your best ideas?" field="bestIdeas" options={bestIdeasOptions} draft={draft} onChange={set} />
        <RadioQuestion title="When it comes to the rules, do you:" field="rules" options={rulesOptions} draft={draft} onChange={set} />
        <RadioQuestion
          title="How many unread e-mails before you start to feel anxious?"
          field="emailAnxiety"
          options={emailAnxietyOptions}
          draft={draft}
          onChange={set}
        />
        <RadioQuestion title="AI's future is..." field="aiFuture" options={aiFutureOptions} draft={draft} onChange={set} />

        {error && <p className="error">{error}</p>}

        <button className="primary" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit & see my data selfie"}
        </button>
      </form>
    </div>
  );
}
