import { validateCustomEnum } from "isaacscript-common";

export const NullItemIDCustom = {
  BABY_FLYING: Isaac.GetCostumeIdByPath("gfx/characters/baby_flight.anm2"),
} as const;

validateCustomEnum("NullItemIDCustom", NullItemIDCustom);
