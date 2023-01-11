import { EntityType, FireplaceVariant } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Fires are holy. */
export class PurpleBaby extends Baby {
  @CallbackCustom(
    ModCallbackCustom.PRE_ENTITY_SPAWN_FILTER,
    EntityType.FIREPLACE,
  )
  preEntitySpawnFilter(
    entityType: EntityType,
    variant: int,
    subType: int,
    _position: Vector,
    _velocity: Vector,
    _spawner: Entity | undefined,
    initSeed: Seed,
  ): [EntityType, int, int, int] | undefined {
    if (
      variant !== (FireplaceVariant.BLUE as int) &&
      variant !== (FireplaceVariant.WHITE as int)
    ) {
      return [entityType, FireplaceVariant.BLUE, subType, initSeed];
    }

    return undefined;
  }
}
