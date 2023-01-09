import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** High shot speed. */
export class CupcakeBaby extends Baby {
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.SHOT_SPEED)
  evaluateCacheShotSpeed(player: EntityPlayer): void {
    player.ShotSpeed = 4;
  }
}
