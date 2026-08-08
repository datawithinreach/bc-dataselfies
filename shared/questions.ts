import { palette } from "./palette";

// The visual vocabulary, BC-Data-Selfies edition.
// Loosely modeled on Giorgia Lupi's TED "Data Selfies" (2017): every answer
// maps to one distinct visual channel on a person's circular "portrait" mark.
// Channel -> question:
//   base shape (black ink)      -> affiliation
//   background color wash       -> school / department
//   two colored parallel lines  -> continent
//   small black arc, top        -> early bird / night owl
//   single colored dot          -> when you get best ideas
//   colored half-circle fill    -> rules: follow / fudge / ignore
//   row of black dots           -> unread-email anxiety threshold
//   small tick mark, bottom     -> AI's future: bright / grim

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

export const chronotypeOptions: ArcOption[] = [
  { value: "early_bird", label: "Early bird", direction: "up" },
  { value: "night_owl", label: "Night owl", direction: "down" },
];

export const bestIdeasOptions: ColorOption[] = [
  { value: "falling_asleep", label: "Right before I fall asleep / wake up", color: palette.red },
  { value: "getting_ready", label: "While I'm getting ready", color: palette.darkMaroon },
  { value: "commute", label: "During my commute", color: palette.burntOrange },
  { value: "office", label: "At the office / lab", color: palette.darkSlateBlue },
  { value: "beverage", label: "After an adult beverage", color: palette.yellowGold },
  { value: "anytime", label: "I never know when brilliance might strike", color: palette.darkBlue },
];

export const rulesOptions: ColorOption[] = [
  { value: "follow", label: "Follow them", color: palette.darkBlue },
  { value: "fudge", label: "Fudge them", color: palette.yellowGold },
  { value: "ignore", label: "Ignore them", color: palette.red },
];

export const emailAnxietyOptions: DotCountOption[] = [
  { value: "1", label: "1", dots: 1 },
  { value: "20", label: "20", dots: 2 },
  { value: "100", label: "Over 100", dots: 3 },
  { value: "1000s", label: "I don't get anxious until the 1000s", dots: 4 },
];

export const aiFutureOptions: ArcOption[] = [
  { value: "bright", label: "Bright", direction: "up" },
  { value: "grim", label: "Grim", direction: "down" },
];

export interface ResponseInput {
  name: string;
  affiliation: string;
  school: string;
  continent: string;
  chronotype: string;
  bestIdeas: string;
  rules: string;
  emailAnxiety: string;
  aiFuture: string;
}

export interface ResponseRecord extends ResponseInput {
  id: string;
  createdAt: number;
}

export const REQUIRED_FIELDS: (keyof ResponseInput)[] = [
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

const VALID_VALUES: Record<Exclude<keyof ResponseInput, "name">, Set<string>> = {
  affiliation: new Set(affiliationOptions.map((o) => o.value)),
  school: new Set(schoolOptions.map((o) => o.value)),
  continent: new Set(continentOptions.map((o) => o.value)),
  chronotype: new Set(chronotypeOptions.map((o) => o.value)),
  bestIdeas: new Set(bestIdeasOptions.map((o) => o.value)),
  rules: new Set(rulesOptions.map((o) => o.value)),
  emailAnxiety: new Set(emailAnxietyOptions.map((o) => o.value)),
  aiFuture: new Set(aiFutureOptions.map((o) => o.value)),
};

export function validateResponse(input: Partial<ResponseInput>): string | null {
  for (const field of REQUIRED_FIELDS) {
    const value = input[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      return `Missing field: ${field}`;
    }
  }
  if (input.name!.trim().length > 80) return "Name is too long";
  for (const field of Object.keys(VALID_VALUES) as (keyof typeof VALID_VALUES)[]) {
    if (!VALID_VALUES[field].has(input[field]!)) {
      return `Invalid value for ${field}`;
    }
  }
  return null;
}

export function findOption<T extends Option>(options: T[], value: string): T {
  const found = options.find((o) => o.value === value);
  if (!found) throw new Error(`Unknown option value: ${value}`);
  return found;
}
