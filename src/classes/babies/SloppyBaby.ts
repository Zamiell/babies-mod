import {
  CollectibleType,
  EffectVariant,
  ModCallback,
  PlayerForm,
} from "isaac-typescript-definitions";
import { Callback, hasCollectible, hasForm } from "isaacscript-common";
import { Baby } from "../Baby";

const BUGGED_COLLECTIBLE_TYPES = [
  CollectibleType.INNER_EYE, // 2
  CollectibleType.MUTANT_SPIDER, // 153
  CollectibleType.TWENTY_TWENTY, // 245
  CollectibleType.WIZ, // 358
] as const;

const BUGGED_TRANSFORMATIONS = [
  PlayerForm.CONJOINED, // 7
  PlayerForm.BOOKWORM, // 10
] as const;

/** Starts with Epic Fetus (improved). */
export class SloppyBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return (
      !hasCollectible(player, ...BUGGED_COLLECTIBLE_TYPES) &&
      !hasForm(player, ...BUGGED_TRANSFORMATIONS)
    );
  }

  /**
   * Shorten the lag time of the missiles. (This is not possible in the `POST_EFFECT_INIT` callback
   * since "effect.Timeout" is -1.)
   */
  @Callback(ModCallback.POST_EFFECT_UPDATE, EffectVariant.TARGET)
  postEffectUpdateTarget(effect: EntityEffect): void {
    const player = Isaac.GetPlayer();

    // There is a bug where the target will disappear if you have multiple shots.
    if (
      hasCollectible(player, ...BUGGED_COLLECTIBLE_TYPES) ||
      hasForm(player, ...BUGGED_TRANSFORMATIONS)
    ) {
      return;
    }

    if (effect.FrameCount === 1) {
      effect.Timeout = 10; // 9 does not result in a missile coming out.
    }
  }
}
