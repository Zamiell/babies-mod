import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback, repeat } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** -30% damage on hit. */
export class FairymanBaby extends Baby {
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.DAMAGE)
  evaluateCacheDamage(player: EntityPlayer): void {
    repeat(g.run.babyCounters, () => {
      player.Damage *= 0.7;
    });
  }
}
