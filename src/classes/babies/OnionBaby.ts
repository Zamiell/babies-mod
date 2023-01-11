import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

const DATA_KEY = "BabiesModSpedUp";

const IMMUNE_ENTITY_TYPES: ReadonlySet<EntityType> = new Set([
  EntityType.MOMS_HEART, // 78
  EntityType.ISAAC, // 102
]);

/** Projectiles have 2x speed. */
export class OnionBaby extends Baby {
  @Callback(ModCallback.POST_PROJECTILE_UPDATE)
  postProjectileUpdate(projectile: EntityProjectile): void {
    if (IMMUNE_ENTITY_TYPES.has(projectile.SpawnerType)) {
      return;
    }

    const data = projectile.GetData();
    if (data[DATA_KEY] === undefined) {
      data[DATA_KEY] = true;
      projectile.Velocity = projectile.Velocity.mul(2);
    }
  }
}
