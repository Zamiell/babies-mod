import {
  CollectibleAnimation,
  CollectibleType,
  ModCallback,
  PillColor,
  PillEffect,
  PlayerItemAnimation,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Lemon Mishap (improved). */
export class LemonBaby extends Baby {
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.LEMON_MISHAP)
  preUseItemLemonMishap(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    player.UsePill(PillEffect.LEMON_PARTY, PillColor.NULL);
    player.AnimateCollectible(
      CollectibleType.LEMON_MISHAP,
      PlayerItemAnimation.USE_ITEM,
      CollectibleAnimation.PLAYER_PICKUP,
    );

    // Cancel the original effect.
    return true;
  }
}
