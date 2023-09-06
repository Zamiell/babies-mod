import type { PillEffect } from "isaac-typescript-definitions";
import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback, repeat } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    pillsUsed: 0,
  },
};

/** +1 damage per pill used. */
export class BubblesBaby extends Baby {
  v = v;

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.DAMAGE)
  evaluateCacheDamage(player: EntityPlayer): void {
    repeat(v.run.pillsUsed, () => {
      player.Damage++;
    });
  }

  // 8
  @Callback(ModCallback.POST_USE_PILL)
  postUsePill(_pillEffect: PillEffect, player: EntityPlayer): void {
    v.run.pillsUsed++;

    player.AddCacheFlags(CacheFlag.DAMAGE);
    player.EvaluateItems();
  }
}
