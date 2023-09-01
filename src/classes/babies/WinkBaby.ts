import { LevelStage, RoomType } from "isaac-typescript-definitions";
import {
  isGreedMode,
  levelHasRoomType,
  onAscent,
  onStage,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Vanishing Twin. */
export class WinkBaby extends Baby {
  /** Only valid for floors with Boss Rooms that do not contain story bosses. */
  override isValid(): boolean {
    return (
      levelHasRoomType(RoomType.BOSS) &&
      !onStage(
        LevelStage.DEPTHS_2, // 6
        LevelStage.WOMB_2, // 8
        LevelStage.BLUE_WOMB, // 9
        LevelStage.SHEOL_CATHEDRAL, // 10
        LevelStage.DARK_ROOM_CHEST, // 11
      ) &&
      !isGreedMode() &&
      !onAscent()
    );
  }
}
