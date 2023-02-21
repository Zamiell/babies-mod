import {
  EntityType,
  LevelStage,
  ModCallback,
  ProjectileFlag,
} from "isaac-typescript-definitions";
import { Callback, getEffectiveStage, ReadonlySet } from "isaacscript-common";
import { Baby } from "../Baby";

const IMMUNE_ENTITY_TYPES = new ReadonlySet<EntityType>([
  EntityType.MOMS_HEART, // 78
  EntityType.ISAAC, // 102
]);

/** Enemies have homing projectiles. */
export class NosferatuBaby extends Baby {
  /** This baby is too difficult for the later floors. */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage < LevelStage.WOMB_2;
  }

  @Callback(ModCallback.POST_PROJECTILE_UPDATE)
  postProjectileUpdate(projectile: EntityProjectile): void {
    if (IMMUNE_ENTITY_TYPES.has(projectile.SpawnerType)) {
      return;
    }

    projectile.AddProjectileFlags(ProjectileFlag.SMART);
  }
}
