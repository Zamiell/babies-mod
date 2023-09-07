import { ModFeature } from "isaacscript-common";
import type { RandomBabyType } from "../../enums/RandomBabyType";

const v = {
  run: {
    babyType: null as RandomBabyType | null,
  },
};

export class BabySelection extends ModFeature {
  v = v;
}

export function setBabyType(babyType: RandomBabyType): void {
  v.run.babyType = babyType;
}

export function getBabyType(): RandomBabyType | undefined {
  return v.run.babyType ?? undefined;
}
