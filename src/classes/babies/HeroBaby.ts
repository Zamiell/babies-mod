import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
} from "isaacscript-common";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** 3x damage + 3x tear rate when at 1 heart or less. */
export class HeroBaby extends Baby {
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
    // so we do it instead in the next `POST_UPDATE` callback.
    mod.runNextGameFrame(() => {
      const player = Isaac.GetPlayer();
      player.AddCacheFlags(CacheFlag.DAMAGE); // 1
      player.AddCacheFlags(CacheFlag.FIRE_DELAY); // 2
      player.EvaluateItems();
    });

    return undefined;
  }
}
