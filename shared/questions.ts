import { palette } from "./palette";

// The visual vocabulary, BC-Data-Selfies edition.
// Loosely modeled on Giorgia Lupi's TED "Data Selfies" (2017): every answer
// maps to one distinct visual channel on a person's circular "portrait" mark.
// Every mark now lives inside the main circle's own boundary.
// Channel -> question:
//   base shape (black ink), center            -> affiliation
//   colored bottom half-fill                  -> school / department
//   two colored parallel lines, fixed angle    -> continent
//   ring of rays (sun) / crescent (moon)       -> early bird / night owl
//   small arc, inset near top                  -> AI's future: bright / grim
//   single colored dot                         -> rules: follow / fudge / ignore
//   cluster of black dots (count-coded)        -> favorite dining hall

export interface Option<Extra extends Record<string, unknown> = Record<string, never>> {
  value: string;
  label: string;
}

export type AffiliationShape = "bars" | "triangle" | "circle" | "diamond" | "hex";
export interface AffiliationOption extends Option {
  shape: AffiliationShape;
}

export interface ColorOption extends Option {
  color: string;
}

export type ArcDirection = "up" | "down";
export interface ArcOption extends Option {
  direction: ArcDirection;
}

export type ChronotypeIcon = "sun" | "moon";
export interface ChronotypeOption extends Option {
  icon: ChronotypeIcon;
}

export interface DotCountOption extends Option {
  dots: number;
}

export const affiliationOptions: AffiliationOption[] = [
  { value: "staff", label: "Staff", shape: "bars" },
  { value: "faculty", label: "Faculty", shape: "triangle" },
  { value: "undergrad", label: "Undergraduate student", shape: "circle" },
  { value: "grad", label: "Graduate student", shape: "diamond" },
  { value: "visitor", label: "Visitor / alum / other", shape: "hex" },
];

export const schoolOptions: ColorOption[] = [
  { value: "mcas", label: "Morrissey College of Arts & Sciences", color: palette.maroon },
  { value: "csom", label: "Carroll School of Management", color: palette.darkBlue },
  { value: "lynch", label: "Lynch School of Education & Human Development", color: palette.burntOrange },
  { value: "ssw", label: "School of Social Work", color: palette.darkSlateBlue },
  { value: "law", label: "BC Law School", color: palette.darkMaroon },
  { value: "cson", label: "Connell School of Nursing", color: palette.yellowGold },
  { value: "staff_other", label: "Staff / Administration / Other", color: palette.warmGray },
];

export const continentOptions: ColorOption[] = [
  { value: "na", label: "North America", color: palette.darkBlue },
  { value: "sa", label: "South America", color: palette.burntOrange },
  { value: "eu", label: "Europe", color: palette.darkSlateBlue },
  { value: "af", label: "Africa", color: palette.yellowGold },
  { value: "as", label: "Asia", color: palette.red },
  { value: "oc", label: "Oceania", color: palette.lightSlateBlue },
];

export const chronotypeOptions: ChronotypeOption[] = [
  { value: "early_bird", label: "Early bird", icon: "sun" },
  { value: "night_owl", label: "Night owl", icon: "moon" },
];

export const rulesOptions: ColorOption[] = [
  { value: "follow", label: "Follow them", color: palette.darkBlue },
  { value: "fudge", label: "Fudge them", color: palette.yellowGold },
  { value: "ignore", label: "Ignore them", color: palette.red },
];

export const aiFutureOptions: ArcOption[] = [
  { value: "bright", label: "Bright", direction: "up" },
  { value: "grim", label: "Grim", direction: "down" },
];

export const diningHallOptions: DotCountOption[] = [
  { value: "hillside", label: "Hillside Cafe", dots: 1 },
  { value: "lower_live", label: "Lower Live", dots: 2 },
  { value: "tully", label: "Tully Cafe", dots: 3 },
  { value: "eagles_nest", label: "Eagle's Nest", dots: 4 },
  { value: "carney", label: "Carney Dining Room", dots: 5 },
  { value: "coro", label: "CoRo Cafe", dots: 6 },
];

export interface ResponseInput {
  name: string;
  affiliation: string;
  school: string;
  continent: string;
  chronotype: string;
  rules: string;
  aiFuture: string;
  diningHall: string;
}

export interface ResponseRecord extends ResponseInput {
  id: string;
  createdAt: number;
}

export function findOption<T extends Option>(options: T[], value: string): T {
  const found = options.find((o) => o.value === value);
  if (!found) throw new Error(`Unknown option value: ${value}`);
  return found;
}

const VALID_VALUES: Record<Exclude<keyof ResponseInput, "name">, Set<string>> = {
  affiliation: new Set(affiliationOptions.map((o) => o.value)),
  school: new Set(schoolOptions.map((o) => o.value)),
  continent: new Set(continentOptions.map((o) => o.value)),
  chronotype: new Set(chronotypeOptions.map((o) => o.value)),
  rules: new Set(rulesOptions.map((o) => o.value)),
  aiFuture: new Set(aiFutureOptions.map((o) => o.value)),
  diningHall: new Set(diningHallOptions.map((o) => o.value)),
};

/**
 * Validates an unknown value (e.g. from an uploaded JSON file) against the
 * current question set, returning a clean ResponseInput or null. Guards
 * against bad/stale data crashing the wall — every answer eventually flows
 * into findOption(), which throws on an unrecognized value, and that would
 * take down the whole portrait list rather than just the one bad record.
 */
export function sanitizeResponseInput(input: unknown): ResponseInput | null {
  if (typeof input !== "object" || input === null) return null;
  const record = input as Record<string, unknown>;
  for (const field of Object.keys(VALID_VALUES) as (keyof typeof VALID_VALUES)[]) {
    const value = record[field];
    if (typeof value !== "string" || !VALID_VALUES[field].has(value)) return null;
  }
  const name = typeof record.name === "string" ? record.name.trim().slice(0, 80) : "";
  return {
    name,
    affiliation: record.affiliation as string,
    school: record.school as string,
    continent: record.continent as string,
    chronotype: record.chronotype as string,
    rules: record.rules as string,
    aiFuture: record.aiFuture as string,
    diningHall: record.diningHall as string,
  };
}
