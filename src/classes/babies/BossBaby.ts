import { LevelStage } from "isaac-typescript-definitions";
import { isGreedMode, onAscent, onStage } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with There's Options. */
export class BossBaby extends Baby {
  /** Only valid for floors with Boss Rooms that do not contain story bosses. */
  override isValid(): boolean {
    return (
      levelHasRoomType(RoomType.BOSS) &&
      !onStage(LevelStage.DEPTHS_2) && // 6
      !onStage(LevelStage.WOMB_2) && // 8
      !onStage(LevelStage.BLUE_WOMB) && // 9
      !onStage(LevelStage.SHEOL_CATHEDRAL) && // 10
      !onStage(LevelStage.DARK_ROOM_CHEST) && // 11
      !onStage(LevelStage.HOME) && // 13
      !isGreedMode() &&
      !onAscent()
    );
  }
}
