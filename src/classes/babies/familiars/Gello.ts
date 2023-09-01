import { LevelStage } from "isaac-typescript-definitions";
import { isGreedMode, onStage } from "isaacscript-common";
import { Baby } from "../../Baby";

/** Starts with Sol. */
export class Gello extends Baby {
  override isValid(): boolean {
    return (
      !onStage(LevelStage.BLUE_WOMB) &&
      !onStage(LevelStage.HOME) &&
      !isGreedMode()
    );
  }
}
