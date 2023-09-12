import type { DamageFlag } from "isaac-typescript-definitions";
import { EntityType, SuckerVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  isSelfDamage,
  spawn,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a Bulb on hit. */
export class MermanBaby extends Baby {
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

    spawn(EntityType.SUCKER, SuckerVariant.BULB, 0, player.Position);
    return undefined;
  }
}
