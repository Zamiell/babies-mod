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

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    if (
      tear.SubType !== 1 ||
      // Tears will not die if they hit an enemy, but they will die if they hit a wall or object.
      !tear.IsDead()
    ) {
      return;
    }

    // The streak ended.
    g.run.babyCounters = 0;
    g.p.AddCacheFlags(CacheFlag.FIRE_DELAY);
    g.p.EvaluateItems();
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
