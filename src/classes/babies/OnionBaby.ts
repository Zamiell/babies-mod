import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Projectiles have 2x speed. */
export class OnionBaby extends Baby {
  @Callback(ModCallback.POST_PROJECTILE_INIT)
  postProjectileInit(projectile: EntityProjectile): void {
    projectile.Velocity = projectile.Velocity.mul(2);
  }
}
