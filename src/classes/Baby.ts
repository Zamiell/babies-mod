import { ModCallback } from "isaac-typescript-definitions";
import {
  isFirstPlayer,
  ModCallbackCustom,
  ModFeature,
} from "isaacscript-common";
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

  override callbackConditionalFunc = (
    vanilla: boolean,
    modCallback: ModCallback | ModCallbackCustom,
    ...callbackArgs: unknown[]
  ): boolean => {
    if (g.run.babyType !== this.babyType) {
      return false;
    }

    if (vanilla && modCallback === ModCallback.PRE_GET_COLLECTIBLE) {
      if (g.run.gettingCollectible) {
        return false;
      }
    }

    if (!vanilla && modCallback === ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER) {
      const player = callbackArgs[0] as EntityPlayer;
      if (!isFirstPlayer(player)) {
        return false;
      }
    }

    if (!vanilla && modCallback === ModCallbackCustom.INPUT_ACTION_PLAYER) {
      const player = callbackArgs[0] as EntityPlayer;
      if (!isFirstPlayer(player)) {
        return false;
      }
    }

    if (
      !vanilla &&
      modCallback === ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED
    ) {
      const player = callbackArgs[0] as EntityPlayer;
      if (!isFirstPlayer(player)) {
        return false;
      }
    }

    return true;
  };

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isValid(player: EntityPlayer): boolean {
    return true;
  }

  /** Called from "babyAdd.ts". */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAdd(player: EntityPlayer): void {}

  /** Called from "babyRemove.ts". */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRemove(player: EntityPlayer, oldBabyCounters: int): void {}
}
