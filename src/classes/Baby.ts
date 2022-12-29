import { ModFeature } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { mod } from "../mod";

export class Baby extends ModFeature {
  randomBabyType: RandomBabyType;

  constructor(randomBabyType: RandomBabyType) {
    super(mod);
    this.randomBabyType = randomBabyType;
  }
}
