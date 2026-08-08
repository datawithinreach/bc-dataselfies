import { palette } from "./palette";

// The visual vocabulary, BC-Data-Selfies edition.
// Loosely modeled on Giorgia Lupi's TED "Data Selfies" (2017): every answer
// maps to one distinct visual channel on a person's circular "portrait" mark.
// Channel -> question:
//   base shape (black ink)         -> affiliation
//   colored bottom half-fill       -> school / department
//   two colored parallel lines     -> continent
//   sun / moon icon, top           -> early bird / night owl
//   colored arc, top               -> AI's future: bright / grim
//   single colored dot             -> rules: follow / fudge / ignore
//   colored diamond stamp, bottom  -> favorite dining hall

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

export const diningHallOptions: ColorOption[] = [
  { value: "hillside", label: "Hillside Cafe", color: palette.gold },
  { value: "lower_live", label: "Lower Live", color: palette.darkBlue },
  { value: "tully", label: "Tully Cafe", color: palette.burntOrange },
  { value: "eagles_nest", label: "Eagle's Nest", color: palette.maroon },
  { value: "carney", label: "Carney Dining Room", color: palette.darkSlateBlue },
  { value: "coro", label: "CoRo Cafe", color: palette.yellowGold },
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
