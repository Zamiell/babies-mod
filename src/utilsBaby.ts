import { getBabyType } from "./classes/features/BabySelection";
import type { RandomBabyType } from "./enums/RandomBabyType";
import type { BabyDescription } from "./interfaces/BabyDescription";
import { BABIES } from "./objects/babies";

export function getCurrentBaby():
  | {
      babyType: RandomBabyType;
      baby: BabyDescription;
    }
  | undefined {
  const babyType = getBabyType();
  if (babyType === undefined) {
    return undefined;
  }

  const baby = BABIES[babyType];
  return { babyType, baby };
}
