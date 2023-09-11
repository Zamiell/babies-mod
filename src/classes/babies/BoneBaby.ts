import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Reveals a random room on room clear. */
export class BoneBaby extends Baby {
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    /// const roomsInsideGrid = getRoomsInsideGrid();
    /// const unrevealedRooms = roomsInsideGrid.filter(roomDescriptor => roomDescriptor.DisplayFlags)

    return undefined;
  }
}
