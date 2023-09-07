import {
  EntityType,
  ModCallback,
  ProjectileFlag,
} from "isaac-typescript-definitions";
import { Callback, ReadonlySet } from "isaacscript-common";
import { Baby } from "../Baby";

const IMMUNE_ENTITY_TYPES = new ReadonlySet<EntityType>([
  EntityType.MOMS_HEART, // 78
  EntityType.ISAAC, // 102
]);

/** Enemies have spectral projectiles. */
export class NosferatuBaby extends Baby {
  @Callback(ModCallback.POST_PROJECTILE_UPDATE)
  postProjectileUpdate(projectile: EntityProjectile): void {
    if (IMMUNE_ENTITY_TYPES.has(projectile.SpawnerType)) {
      return;
    }

    projectile.AddProjectileFlags(ProjectileFlag.GHOST);
  }
}
