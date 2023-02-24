import {
  EntityType,
  GridEntityXMLType,
  LevelStage,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, game, onStage } from "isaacscript-common";
import { GRID_ENTITY_REPLACEMENT_EXCEPTIONS } from "../../constants";
import { Baby } from "../Baby";

/** Everything is TNT. */
export class RedWrestlerBaby extends Baby {
  /** There are almost no grid entities on the final floor. */
  override isValid(): boolean {
    return !onStage(LevelStage.DARK_ROOM_CHEST);
  }

  @Callback(ModCallback.PRE_ROOM_ENTITY_SPAWN)
  preRoomEntitySpawn(
    entityTypeOrGridEntityXMLType: EntityType | GridEntityXMLType,
  ): [EntityType | GridEntityXMLType, int, int] | undefined {
    const room = game.GetRoom();

    // We only care about grid entities.
    if ((entityTypeOrGridEntityXMLType as int) < 1000) {
      return undefined;
    }
    const gridEntityXMLType =
      entityTypeOrGridEntityXMLType as GridEntityXMLType;

    if (
      room.IsFirstVisit() &&
      !GRID_ENTITY_REPLACEMENT_EXCEPTIONS.has(gridEntityXMLType)
    ) {
      return [GridEntityXMLType.TNT, 0, 0];
    }

    return undefined;
  }
}
