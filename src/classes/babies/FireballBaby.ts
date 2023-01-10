import { DamageFlag, EntityType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  isFirstPlayer,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Explosion immunity + fire immunity. */
export class FireballBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    player: EntityPlayer,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
  ): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    if (source.Type === EntityType.FIREPLACE) {
      return false;
    }

    return undefined;
  }
}
