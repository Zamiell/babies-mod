import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  setEntityRandomColor,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Acid trip. */
export class ColorfulBaby extends Baby {
  // 27
  @Callback(ModCallback.POST_NPC_INIT)
  postNPCInit(npc: EntityNPC): void {
    setEntityRandomColor(npc);
  }

  // 34
  @Callback(ModCallback.POST_PICKUP_INIT)
  postPickupInit(pickup: EntityPickup): void {
    setEntityRandomColor(pickup);
  }

  // 54
  @Callback(ModCallback.POST_EFFECT_INIT)
  postEffectInit(effect: EntityEffect): void {
    setEntityRandomColor(effect);
  }

  // 57
  @Callback(ModCallback.POST_BOMB_INIT)
  postBombInit(bomb: EntityBomb): void {
    setEntityRandomColor(bomb);
  }

  /** This does not work in the `POST_LASER_INIT` callback for some reason. */
  @CallbackCustom(ModCallbackCustom.POST_LASER_INIT_LATE)
  postLaserInitLate(laser: EntityLaser): void {
    setEntityRandomColor(laser);
  }

  /** This does not work in the `POST_PROJECTILE_INIT` callback for some reason. */
  @CallbackCustom(ModCallbackCustom.POST_PROJECTILE_INIT_LATE)
  postProjectileInitLate(projectile: EntityProjectile): void {
    setEntityRandomColor(projectile);
  }

  /** This does not work in the `POST_TEAR_INIT` callback for some reason. */
  @CallbackCustom(ModCallbackCustom.POST_TEAR_INIT_LATE)
  postTearInitLate(tear: EntityTear): void {
    setEntityRandomColor(tear);
  }
}
