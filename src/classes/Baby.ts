import { ModFeature } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { mod } from "../mod";

export class Baby extends ModFeature {
  private randomBabyType: RandomBabyType;
  protected override callbackConditionalFunc = (): boolean =>
    g.run.babyType === this.randomBabyType;

  constructor(randomBabyType: RandomBabyType) {
    super(mod);
    this.randomBabyType = randomBabyType;
  }

  public onRemove(): void {}
}
