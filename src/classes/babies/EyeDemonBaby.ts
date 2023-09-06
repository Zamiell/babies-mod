import {
  LevelStage,
  ModCallback,
  ProjectileFlag,
} from "isaac-typescript-definitions";
import { Callback, onStageOrHigher } from "isaacscript-common";
import { Baby } from "../Baby";

/** Enemies have Continuum projectiles. */
export class EyeDemonBaby extends Baby {
  override isValid(): boolean {
    // Having Continuum projectile speed for It Lives, Hush, Isaac, and Blue Baby would be too
    // punishing.
    return !onStageOrHigher(LevelStage.WOMB_2);
  }

  @Callback(ModCallback.POST_PROJECTILE_INIT)
  postProjectileInit(projectile: EntityProjectile): void {
    projectile.AddProjectileFlags(ProjectileFlag.CONTINUUM);
    projectile.Height *= 2;
  }
}
