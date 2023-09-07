import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";
import { startShockwaveLine } from "../features/Shockwaves";

/** Shockwave tears. */
export class VoxdogBaby extends Baby {
  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FIRE_DELAY)
  evaluateCacheFireDelay(player: EntityPlayer): void {
    player.MaxFireDelay = Math.ceil(player.MaxFireDelay * 2);
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.Remove();

    const velocity = tear.Velocity.Normalized().mul(30);
    startShockwaveLine(tear.Position, velocity);
  }
}
