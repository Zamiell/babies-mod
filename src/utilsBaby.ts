import type { RandomBabyType } from "./enums/RandomBabyType";
import { g } from "./globals";
import type { BabyDescription } from "./interfaces/BabyDescription";
import { BABIES } from "./objects/babies";

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
