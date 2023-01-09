import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback, repeat } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Accuracy increases tear rate. */
export class SadBunnyBaby extends Baby {
  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FIRE_DELAY)
  evaluateCacheFireDelay(player: EntityPlayer): void {
    repeat(g.run.babyCounters, () => {
      player.MaxFireDelay--;
    });
  }

  // 42
  @Callback(ModCallback.PRE_TEAR_COLLISION)
  preTearCollision(tear: EntityTear): boolean | undefined {
    if (tear.SubType === 1) {
      g.run.babyCounters++;
      g.p.AddCacheFlags(CacheFlag.FIRE_DELAY);
      g.p.EvaluateItems();
    }

    return undefined;
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.SubType = 1; // Mark that we shot this tear.
  }
}
