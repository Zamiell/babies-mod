import type { EntityType } from "isaac-typescript-definitions";
import {
  GridEntityXMLType,
  LevelStage,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  game,
  isGridEntityXMLType,
  onStage,
} from "isaacscript-common";
import { GRID_ENTITY_REPLACEMENT_EXCEPTIONS } from "../../constants";
import { Baby } from "../Baby";

/** Everything is Red Poop. */
export class ChompersBaby extends Baby {
  /** There are almost no grid entities on Dark Room, The Chest, and Home. */
  override isValid(): boolean {
    return !onStage(LevelStage.DARK_ROOM_CHEST, LevelStage.HOME);
  }

  @Callback(ModCallback.PRE_ROOM_ENTITY_SPAWN)
  preRoomEntitySpawn(
    entityTypeOrGridEntityXMLType: EntityType | GridEntityXMLType,
    _variant: int,
    _subType: int,
    _gridIndex: int,
    _initSeed: Seed,
  ):
    | [type: EntityType | GridEntityXMLType, variant: int, subType: int]
    | undefined {
    const room = game.GetRoom();
    if (!room.IsFirstVisit()) {
      return undefined;
    }

    // We only convert grid entities.
    if (!isGridEntityXMLType(entityTypeOrGridEntityXMLType)) {
      return undefined;
    }

    if (GRID_ENTITY_REPLACEMENT_EXCEPTIONS.has(entityTypeOrGridEntityXMLType)) {
      return undefined;
    }

    return [GridEntityXMLType.POOP_RED, 0, 0];
  }
}
