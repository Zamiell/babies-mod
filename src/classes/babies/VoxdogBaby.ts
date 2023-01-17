import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import {
  shockwavesPostUpdate,
  startShockwaveLine,
} from "../../features/shockwaves";
import { Baby } from "../Baby";

/** Shockwave tears. */
export class VoxdogBaby extends Baby {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    shockwavesPostUpdate();
  }

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FIRE_DELAY)
  evaluateCacheFireDelay(player: EntityPlayer): void {
    player.MaxFireDelay = math.ceil(player.MaxFireDelay * 2);
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.Remove();

    const velocity = tear.Velocity.Normalized().mul(30);
    startShockwaveLine(tear.Position, velocity);
  }
}
