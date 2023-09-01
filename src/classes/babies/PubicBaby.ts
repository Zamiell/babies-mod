import {
  Dimension,
  LevelStage,
  ModCallback,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  game,
  getDimension,
  getDoors,
  isAllRoomsClear,
  onStage,
  onStageOrHigher,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Must full clear. */
export class PubicBaby extends Baby {
  /** Full clearing a final floor is too punishing. */
  override isValid(): boolean {
    return (
      !onStage(LevelStage.BLUE_WOMB) &&
      !onStageOrHigher(LevelStage.DARK_ROOM_CHEST)
    );
  }

  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const room = game.GetRoom();
    const roomClear = room.IsClear();
    const dimension = getDimension();

    // Don't do anything if we already full cleared the floor.
    if (g.run.babyBool) {
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

    const onlyCheckRoomTypes = [RoomType.DEFAULT, RoomType.MINI_BOSS];
    if (isAllRoomsClear(onlyCheckRoomTypes)) {
      g.run.babyBool = true;
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
