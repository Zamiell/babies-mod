import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback, repeat } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    enemiesKilled: 0,
  },
};

/** +0.2 damage per enemy killed. */
export class KillerBaby extends Baby {
  v = v;

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.DAMAGE)
  evaluateCacheDamage(player: EntityPlayer): void {
    repeat(v.run.enemiesKilled, () => {
      player.Damage += 0.2;
    });
  }

  // 68
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(): void {
    const player = Isaac.GetPlayer();

    v.run.enemiesKilled++;
    player.AddCacheFlags(CacheFlag.DAMAGE);
    player.EvaluateItems();
  }
}
