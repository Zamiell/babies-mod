import { DamageFlag, EntityType } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Explosion immunity + fire immunity. */
export class FireballBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    _player: EntityPlayer,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
  ): boolean | undefined {
    if (source.Type === EntityType.FIREPLACE) {
      return false;
    }

    return undefined;
  }
}
