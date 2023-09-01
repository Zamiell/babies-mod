import { LevelStage } from "isaac-typescript-definitions";
import { isGreedMode, onAscent, onStage } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with There's Options. */
export class BossBaby extends Baby {
  /** Only valid for floors with Boss rooms excluding story bosses. */
  override isValid(): boolean {
    return (
      !onStage(LevelStage.SHEOL_CATHEDRAL) &&
      !onStage(LevelStage.DARK_ROOM_CHEST) &&
      !onStage(LevelStage.HOME) &&
      !onStage(LevelStage.BLUE_WOMB) &&
      !onStage(LevelStage.DEPTHS_2) &&
      !onStage(LevelStage.WOMB_2) &&
      !isGreedMode() &&
      !onAscent()
    );
  }
}
