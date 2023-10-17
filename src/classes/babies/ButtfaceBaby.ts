import {
  GridEntityType,
  ModCallback,
  PoopGridEntityVariant,
} from "isaac-typescript-definitions";
import { Callback, spawnGridEntityWithVariant } from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a Black Poop per enemy killed. */
export class ButtfaceBaby extends Baby {
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    spawnGridEntityWithVariant(
      GridEntityType.POOP,
      PoopGridEntityVariant.BLACK,
      entity.Position,
      false,
    );
  }
}
