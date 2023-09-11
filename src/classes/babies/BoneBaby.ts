import { DisplayFlag, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  addRoomDisplayFlag,
  getRandomArrayElement,
  getRoomsInsideGrid,
  isRoomVisible,
  newRNG,
} from "isaacscript-common";
import { setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** Reveals a random room on room clear. */
export class BoneBaby extends Baby {
  v = v;

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    const roomsInsideGrid = getRoomsInsideGrid();
    const nonVisibleRooms = roomsInsideGrid.filter(
      (roomDescriptor) => !isRoomVisible(roomDescriptor),
    );
    if (nonVisibleRooms.length === 0) {
      return;
    }

    const randomRoom = getRandomArrayElement(nonVisibleRooms, v.run.rng);
    addRoomDisplayFlag(randomRoom.SafeGridIndex, DisplayFlag.VISIBLE);

    return undefined;
  }
}
