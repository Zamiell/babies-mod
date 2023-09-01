import { LevelStage } from "isaac-typescript-definitions";
import { onStage } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Luna. */
export class BabyIsYou extends Baby {
  /** Removing floors with no Secret Rooms. */
  override isValid(): boolean {
    return !onStage(LevelStage.HOME) && !onStage(LevelStage.BLUE_WOMB);
  }
}
