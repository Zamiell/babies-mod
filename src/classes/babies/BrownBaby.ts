import { GridEntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback, spawnGridEntity } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Dirty Mind + spawns a poop per enemy killed. */
export class BrownBaby extends Baby {
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    spawnGridEntity(GridEntityType.POOP, entity.Position, false);
  }
}
