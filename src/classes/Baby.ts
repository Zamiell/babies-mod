import { ModFeature } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { mod } from "../mod";
import { BabyDescription } from "../types/BabyDescription";

export class Baby extends ModFeature {
  protected randomBabyType: RandomBabyType;
  protected babyDescription: BabyDescription;

  protected override callbackConditionalFunc = (): boolean =>
    g.run.babyType === this.randomBabyType;

  constructor(
    randomBabyType: RandomBabyType,
    babyDescription: BabyDescription,
  ) {
    super(mod);

    this.randomBabyType = randomBabyType;
    this.babyDescription = babyDescription;
  }

  protected getAttribute<T extends keyof BabyDescription>(
    attributeName: T,
  ): NonNullable<BabyDescription[T]> {
    const attribute = this.babyDescription[attributeName];
    if (attribute === undefined) {
      error(
        `Failed to get the "${attributeName}" attribute for "${this.babyDescription.name}" since it was undefined.`,
      );
    }

    return attribute as NonNullable<BabyDescription[T]>;
  }

  /** Called from "babyCheckValid.ts". */
  public isValid(): boolean {
    return true;
  }

  /** Called from "babyRemove.ts". */
  public onRemove(): void {}
}
