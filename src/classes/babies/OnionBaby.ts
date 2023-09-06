import { LevelStage, ModCallback } from "isaac-typescript-definitions";
import { Callback, onStageOrHigher } from "isaacscript-common";
import { Baby } from "../Baby";

/** Projectiles have 2x speed. */
export class OnionBaby extends Baby {
  override isValid(): boolean {
    // Having faster projectile speed for It Lives, Hush, Isaac, and Blue Baby would be too
    // punishing.
    return !onStageOrHigher(LevelStage.WOMB_2);
  }

  @Callback(ModCallback.POST_PROJECTILE_INIT)
  postProjectileInit(projectile: EntityProjectile): void {
    projectile.Velocity = projectile.Velocity.mul(2);
  }
}
