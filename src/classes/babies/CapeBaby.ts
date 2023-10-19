import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback, getRandomFloat } from "isaacscript-common";
import { FADED_YELLOW } from "../../constants";
import { setTearColor } from "../../utils";
import { Baby } from "../Baby";

/** Spray tears. */
export class CapeBaby extends Baby {
  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FIRE_DELAY)
  evaluateCacheFireDelay(player: EntityPlayer): void {
    player.MaxFireDelay = 1;
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const angleModifier = getRandomFloat(0, 90, undefined) - 45;
    tear.Velocity = tear.Velocity.Rotated(angleModifier);
    setTearColor(tear, FADED_YELLOW);
  }
}
