import type { DamageFlag } from "isaac-typescript-definitions";
import { EntityType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  isSelfDamage,
  ModCallbackCustom,
  spawnNPC,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawn a Bishop on hit. */
export class OneToothBaby extends Baby {
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

    spawnNPC(EntityType.BISHOP, 0, 0, player.Position);

    return undefined;
  }
}
