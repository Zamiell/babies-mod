import {
  CacheFlag,
  FamiliarVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, getFamiliars } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with Leprosy, +5 damage on Leprosy breaking. */
export class BlackEyeBaby extends Baby {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    // We use the "babyCounters" variable to track how Leprocy familiars are in the room.
    const leprocyChunks = getFamiliars(FamiliarVariant.LEPROSY);
    if (leprocyChunks.length < g.run.babyCounters) {
      g.run.babyCounters--;

      // We use the "babyFrame" variable to track how many damage ups we have received.
      g.run.babyFrame++;
      g.p.AddCacheFlags(CacheFlag.DAMAGE);
      g.p.EvaluateItems();
    }
  }

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.DAMAGE)
  evaluateCacheDamage(player: EntityPlayer): void {
    const num = this.getAttribute("num");
    player.Damage += g.run.babyFrame * num;
  }
}
