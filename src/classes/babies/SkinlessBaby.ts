import type { DamageFlag } from "isaac-typescript-definitions";
import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  room: {
    dealingExtraDamage: false,
  },
};

/** 2x damage + takes 2x damage. */
export class SkinlessBaby extends Baby {
  v = v;

  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.DAMAGE)
  evaluateCacheDamage(player: EntityPlayer): void {
    player.Damage *= 2;
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    player: EntityPlayer,
    amount: float,
    damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
    countdownFrames: int,
  ): boolean | undefined {
    if (v.room.dealingExtraDamage) {
      return undefined;
    }

    v.room.dealingExtraDamage = true;
    player.TakeDamage(amount, damageFlags, source, countdownFrames);
    v.room.dealingExtraDamage = false;

    return undefined;
  }
}
