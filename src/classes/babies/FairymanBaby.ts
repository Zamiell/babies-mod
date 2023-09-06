import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  repeat,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numHits: 0,
  },
};

/** -30% damage on hit. */
export class FairymanBaby extends Baby {
  v = v;

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.DAMAGE)
  evaluateCacheDamage(player: EntityPlayer): void {
    repeat(v.run.numHits, () => {
      player.Damage *= 0.7;
    });
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    v.run.numHits++;

    player.AddCacheFlags(CacheFlag.DAMAGE);
    player.EvaluateItems();

    return undefined;
  }
}
