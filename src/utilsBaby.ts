import { RandomBabyType } from "./enums/RandomBabyType";
import { g } from "./globals";
import { BABIES, UNKNOWN_BABY } from "./objects/babies";
import { BabyDescription } from "./types/BabyDescription";

export function getCurrentBaby(): [
  // Normally, we would use "undefined" instead of "-1", but tuples cannot contain undefined in
  // TypeScriptToLua.
  babyType: RandomBabyType | -1,
  baby: BabyDescription,
] {
  const { babyType } = g.run;
  if (babyType === null) {
    return [-1, UNKNOWN_BABY];
  }

  const baby = BABIES[babyType];
  return [babyType, baby];
}

export function getCurrentBabyDescription(): BabyDescription {
  const [, baby] = getCurrentBaby();
  return baby;
}
