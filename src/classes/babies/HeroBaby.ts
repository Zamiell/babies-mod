import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** 3x damage + 3x tear rate when at 1 heart or less. */
export class HeroBaby extends Baby {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    if (g.run.babyBool) {
      g.run.babyBool = false;
      g.p.AddCacheFlags(CacheFlag.DAMAGE); // 1
      g.p.AddCacheFlags(CacheFlag.FIRE_DELAY); // 2
      g.p.EvaluateItems();
    }
  }

  @Callback(ModCallback.EVALUATE_CACHE)
  evaluateCache(player: EntityPlayer, cacheFlag: CacheFlag): void {
    const hearts = player.GetHearts();
    const soulHearts = player.GetSoulHearts();
    const eternalHearts = player.GetEternalHearts();
    const boneHearts = player.GetBoneHearts();
    const rottenHearts = player.GetRottenHearts();
    const totalHearts =
      hearts + soulHearts + eternalHearts + boneHearts * 2 + rottenHearts * 2;

    if (totalHearts <= 2) {
      if (cacheFlag === CacheFlag.DAMAGE) {
        player.Damage *= 3;
      } else if (cacheFlag === CacheFlag.FIRE_DELAY) {
        player.MaxFireDelay = math.ceil(player.MaxFireDelay / 3);
      }
    }
  }
}
