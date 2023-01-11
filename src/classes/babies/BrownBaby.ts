import {
  GridEntityType,
  ModCallback,
  PoopGridEntityVariant,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Dirty Mind + spawns a poop per enemy killed. */
export class BrownBaby extends Baby {
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    Isaac.GridSpawn(
      GridEntityType.POOP,
      PoopGridEntityVariant.NORMAL,
      entity.Position,
    );
  }
}
