import type { DamageFlag } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getNPCs,
  isSelfDamage,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Enemies are fully healed on hit. */
export class CryBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    _player: EntityPlayer,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    if (isSelfDamage(damageFlags)) {
      return undefined;
    }

    for (const npc of getNPCs()) {
      npc.HitPoints = npc.MaxHitPoints;
    }

    return undefined;
  }
}
