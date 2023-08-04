import type { RandomBabyType } from "./enums/RandomBabyType";
import { g } from "./globals";
import { BABIES } from "./objects/babies";
import type { BabyDescription } from "./types/BabyDescription";

export function getCurrentBaby():
  | {
      babyType: RandomBabyType;
      baby: BabyDescription;
    }
  | undefined {
  const { babyType } = g.run;
  if (babyType === null) {
    return undefined;
  }

  const baby = BABIES[babyType];
  return { babyType, baby };
}
