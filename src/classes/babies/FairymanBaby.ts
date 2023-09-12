import type { DamageFlag } from "isaac-typescript-definitions";
import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  isSelfDamage,
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
  entityTakeDmgPlayer(
    player: EntityPlayer,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    if (isSelfDamage(damageFlags)) {
      return undefined;
    }

    v.run.numHits++;

    player.AddCacheFlags(CacheFlag.DAMAGE);
    player.EvaluateItems();

    return undefined;
  }
}
