// BC brand palette, transcribed from the supplied Primary/Secondary Palette sheets.
export const palette = {
  maroon: "#8a100b",
  gold: "#b29d6c",
  black: "#000000",
  warmGray: "#726158",

  darkMaroon: "#501315",
  yellowGold: "#dda93e",
  burntOrange: "#ac6d37",
  red: "#b30000",
  darkBlue: "#003957",
  darkSlateBlue: "#467181",
  lightWarmGray: "#c5bfb0",
  lightSlateBlue: "#adbabc",
} as const;

export type PaletteKey = keyof typeof palette;
