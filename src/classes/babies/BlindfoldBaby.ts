import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Incubus + blindfolded. */
export class BlindfoldBaby extends Baby {
  /**
   * Prevent using Sacrificial Altar on this baby so that they don't delete the Incubus and become
   * softlocked.
   */
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.SACRIFICIAL_ALTAR)
  preUseItemSacrificialAltar(
    _collectibleType: number,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    player.AnimateSad();
    return true;
  }
}
