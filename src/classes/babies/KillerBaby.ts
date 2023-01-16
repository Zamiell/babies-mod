import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback, repeat } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** +0.2 damage per enemy killed. */
export class KillerBaby extends Baby {
  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.DAMAGE)
  evaluateCacheDamage(player: EntityPlayer): void {
    repeat(g.run.babyCounters, () => {
      player.Damage += 0.2;
    });
  }

  // 68
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(): void {
    const player = Isaac.GetPlayer();

    g.run.babyCounters++;
    player.AddCacheFlags(CacheFlag.DAMAGE);
    player.EvaluateItems();
  }
}
