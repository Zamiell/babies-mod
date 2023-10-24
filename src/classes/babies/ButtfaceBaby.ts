import {
  GridEntityType,
  ModCallback,
  PoopGridEntityVariant,
} from "isaac-typescript-definitions";
import { Callback, spawnGridEntityWithVariant } from "isaacscript-common";
import { BUGGY_ENTITY_TYPES_WITH_GRID_ENTITIES_SET } from "../../constants";
import { Baby } from "../Baby";

/** Spawns a Black Poop per enemy killed. */
export class ButtfaceBaby extends Baby {
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    if (BUGGY_ENTITY_TYPES_WITH_GRID_ENTITIES_SET.has(entity.Type)) {
      return;
    }

    spawnGridEntityWithVariant(
      GridEntityType.POOP,
      PoopGridEntityVariant.BLACK,
      entity.Position,
      false,
    );
  }
}
