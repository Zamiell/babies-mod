import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** 2x range. */
export class LipstickBaby extends Baby {
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.RANGE)
  evaluateCacheDamage(player: EntityPlayer): void {
    player.TearHeight *= 2;
  }
}
