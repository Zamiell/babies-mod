import {
  GridEntityType,
  ModCallback,
  PoopGridEntityVariant,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a Black Poop per enemy killed. */
export class ButtfaceBaby extends Baby {
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    Isaac.GridSpawn(
      GridEntityType.POOP,
      PoopGridEntityVariant.BLACK,
      entity.Position,
    );
  }
}
