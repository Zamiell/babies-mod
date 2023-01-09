import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** 0.5x speed. */
export class SnailBaby extends Baby {
  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.SPEED)
  evaluateCacheSpeed(player: EntityPlayer): void {
    player.MoveSpeed *= 0.5;
  }
}
