import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback, repeat } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** +1 damage per pill used. */
export class BubblesBaby extends Baby {
  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.DAMAGE)
  evaluateCacheDamage(player: EntityPlayer): void {
    repeat(g.run.babyCounters, () => {
      player.Damage++;
    });
  }
}
