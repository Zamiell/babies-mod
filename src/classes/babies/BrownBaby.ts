import { GridEntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback, spawnGridEntity } from "isaacscript-common";
import { BUGGY_ENTITY_TYPES_WITH_GRID_ENTITIES_SET } from "../../constants";
import { Baby } from "../Baby";

/** Starts with Dirty Mind + spawns a poop per enemy killed. */
export class BrownBaby extends Baby {
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    if (BUGGY_ENTITY_TYPES_WITH_GRID_ENTITIES_SET.has(entity.Type)) {
      return;
    }

    spawnGridEntity(GridEntityType.POOP, entity.Position, false);
  }
}
