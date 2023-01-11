import { ModCallback, ProjectileFlag } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

const DATA_KEY = "BabiesModModified";

/** Enemies have Continuum projectiles. */
export class EyeDemonBaby extends Baby {
  @Callback(ModCallback.POST_PROJECTILE_UPDATE)
  postProjectileUpdate(projectile: EntityProjectile): void {
    const data = projectile.GetData();
    if (data[DATA_KEY] === undefined) {
      data[DATA_KEY] = true;
      projectile.AddProjectileFlags(ProjectileFlag.CONTINUUM);
      projectile.Height *= 2;
    }
  }
}
