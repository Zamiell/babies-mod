import type { DamageFlag } from "isaac-typescript-definitions";
import { EntityType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Explosion immunity + fire immunity. */
export class FireballBaby extends Baby {
  // 43
  @Callback(ModCallback.POST_PROJECTILE_INIT)
  postProjectileInit(projectile: EntityProjectile): void {
    if (projectile.SpawnerType === EntityType.FIREPLACE) {
      projectile.Remove();
    }
  }

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
