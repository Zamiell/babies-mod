import { LevelStage, RoomType } from "isaac-typescript-definitions";
import { levelHasRoomType, onStage } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with More Options. */
export class PickyBaby extends Baby {
  override isValid(): boolean {
    return (
      levelHasRoomType(RoomType.TREASURE) && !onStage(LevelStage.BLUE_WOMB)
    );
  }
}
