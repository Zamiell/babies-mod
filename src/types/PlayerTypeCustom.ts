import { validateCustomEnum } from "isaacscript-common";

export const PlayerTypeCustom = {
  RANDOM_BABY: Isaac.GetPlayerTypeByName("Random Baby"),
} as const;

validateCustomEnum("PlayerTypeCustom", PlayerTypeCustom);
