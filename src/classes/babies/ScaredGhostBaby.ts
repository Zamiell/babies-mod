import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** 2x speed. */
export class ScaredGhostBaby extends Baby {
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.SPEED)
  evaluateCacheSpeed(player: EntityPlayer): void {
    player.MoveSpeed *= 2;
  }
}
