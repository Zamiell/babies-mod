import { ModCallback, ProjectileFlag } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Enemies projectiles freeze you. */
export class MeanMushroomBaby extends Baby {
  @Callback(ModCallback.POST_PROJECTILE_INIT)
  postProjectileInit(projectile: EntityProjectile): void {
    projectile.AddProjectileFlags(ProjectileFlag.FREEZE);
  }
}
