import {
  LevelStage,
  ModCallback,
  ProjectileFlag,
} from "isaac-typescript-definitions";
import { Callback, onStageOrHigher } from "isaacscript-common";
import { Baby } from "../Baby";

/** Enemies projectiles freeze you. */
export class MeanMushroomBaby extends Baby {
  override isValid(): boolean {
    // Having freezing projectile for It Lives, Hush, Isaac, and Blue Baby would be too punishing.
    return !onStageOrHigher(LevelStage.WOMB_2);
  }

  @Callback(ModCallback.POST_PROJECTILE_INIT)
  postProjectileInit(projectile: EntityProjectile): void {
    projectile.AddProjectileFlags(ProjectileFlag.FREEZE);
  }
}
