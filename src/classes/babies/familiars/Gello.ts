import { LevelStage, RoomType } from "isaac-typescript-definitions";
import { levelHasRoomType, onStage } from "isaacscript-common";
import { Baby } from "../../Baby";

/** Starts with Sol. */
export class Gello extends Baby {
  override isValid(): boolean {
    return levelHasRoomType(RoomType.BOSS) && !onStage(LevelStage.BLUE_WOMB);
  }
}
