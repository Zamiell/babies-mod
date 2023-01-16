import { BombVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, spawnBomb } from "isaacscript-common";
import { Baby } from "../Baby";

/** Projectiles are reflected as bombs. */
export class SorrowBaby extends Baby {
  @Callback(ModCallback.POST_PROJECTILE_UPDATE)
  postProjectileUpdate(projectile: EntityProjectile): void {
    const player = Isaac.GetPlayer();
    const num = this.getAttribute("num");

    // Projectiles are reflected as bombs.
    if (projectile.Position.Distance(player.Position) <= num) {
      spawnBomb(
        BombVariant.NORMAL,
        0,
        projectile.Position,
        projectile.Velocity.mul(-1),
      );
      projectile.Remove();
    }
  }
}
