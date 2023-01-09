import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback, MIN_PLAYER_SHOT_SPEED_STAT } from "isaacscript-common";
import { Baby } from "../Baby";

/** Low shot speed. */
export class BlistersBaby extends Baby {
  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.SHOT_SPEED)
  evaluateCacheShotSpeed(player: EntityPlayer): void {
    // Shot speed has a lower bound, so we cannot set it lower than this.
    player.ShotSpeed = MIN_PLAYER_SHOT_SPEED_STAT;
  }
}
