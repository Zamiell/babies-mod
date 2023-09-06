import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    applyStatsOnNextFrame: false,
  },
};

/** 3x damage + 3x tear rate when at 1 heart or less. */
export class HeroBaby extends Baby {
  v = v;

  // 8
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
        player.MaxFireDelay = Math.ceil(player.MaxFireDelay / 3);
      }
    }
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    // We want to evaluate the cache, but we can't do it here because the damage is not applied yet,
    // so mark to do it later in the next `POST_UPDATE` callback.
    v.run.applyStatsOnNextFrame = true;

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    if (v.run.applyStatsOnNextFrame) {
      v.run.applyStatsOnNextFrame = false;
      player.AddCacheFlags(CacheFlag.DAMAGE); // 1
      player.AddCacheFlags(CacheFlag.FIRE_DELAY); // 2
      player.EvaluateItems();
    }
  }
}
