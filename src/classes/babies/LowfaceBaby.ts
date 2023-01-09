import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** 0.5x range. */
export class LowfaceBaby extends Baby {
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.RANGE)
  evaluateCacheRange(player: EntityPlayer): void {
    player.TearHeight /= 2;

    // Enforce a minimum range.
    if (player.TearHeight > -5) {
      player.TearHeight = -5;
    }
  }
}
