import {
  Dimension,
  GameStateFlag,
  ModCallback,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  game,
  getDimension,
  getDoors,
  isAllRoomsClear,
} from "isaacscript-common";
import { Baby } from "../Baby";

const ROOM_TYPES = [
  RoomType.DEFAULT, // 1
  RoomType.MINI_BOSS, // 6
] as const;

const v = {
  level: {
    isFloorFullCleared: false,
  },
};

/** Must full clear. */
export class PubicBaby extends Baby {
  v = v;

  override isValid(): boolean {
    const onAscent = game.GetStateFlag(GameStateFlag.BACKWARDS_PATH);
    return !onAscent;
  }

  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const room = game.GetRoom();
    const roomClear = room.IsClear();
    const dimension = getDimension();

    if (v.level.isFloorFullCleared) {
      return;
    }

    // The doors are not open because the room is not yet cleared.
    if (!roomClear) {
      return;
    }

    // Don't do anything if we are in an alternate dimension.
    if (dimension !== Dimension.MAIN) {
      return;
    }

    if (isAllRoomsClear(ROOM_TYPES)) {
      v.level.isFloorFullCleared = true;
      return;
    }

    // Keep the boss room door closed.
    for (const door of getDoors()) {
      if (door.IsRoomType(RoomType.BOSS)) {
        door.Bar();
      }
    }
  }
}
