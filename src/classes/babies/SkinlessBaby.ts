import {
  CacheFlag,
  DamageFlag,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** 2x damage + takes 2x damage. */
export class SkinlessBaby extends Baby {
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
    if (g.run.dealingExtraDamage) {
      return;
    }

    g.run.dealingExtraDamage = true;
    player.TakeDamage(amount, damageFlags, source, countdownFrames);
    g.run.dealingExtraDamage = false;

    return undefined;
  }
}
