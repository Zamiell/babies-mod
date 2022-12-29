import { ModFeature } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { mod } from "../mod";
import { BabyDescription } from "../types/BabyDescription";

/**
 * The base class that each baby class extends from. This sets up the callback class methods to only
 * be fired if the relevant baby is active.
 */
export class Baby extends ModFeature {
  babyType: RandomBabyType;
  babyDescription: BabyDescription;

  override callbackConditionalFunc = (): boolean =>
    g.run.babyType === this.babyType;

  constructor(babyType: RandomBabyType, babyDescription: BabyDescription) {
    super(mod);

    this.babyType = babyType;
    this.babyDescription = babyDescription;
  }

  getAttribute<T extends keyof BabyDescription>(
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
  isValid(): boolean {
    return true;
  }

  /** Called from "babyAdd.ts". */
  onAdd(): void {}

  /** Called from "babyRemove.ts". */
  onRemove(_oldBabyCounters: int): void {}
}
