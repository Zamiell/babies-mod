import { LevelCurse, LevelStage } from "isaac-typescript-definitions";
import {
  getEffectiveStage,
  hasFlag,
  onRepentanceStage,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Floors are reversed. */
export class EyebatBaby extends Baby {
  /**
   * - We don't want this on the first floor since it interferes with resetting.
   * - We don't want to have this on any end floors so that we can simply the logic and always spawn
   *   a trapdoor.
   */
  override isValid(): boolean {
    const curses = g.l.GetCurses();
    const effectiveStage = getEffectiveStage();

    return (
      !hasFlag(curses, LevelCurse.LABYRINTH) &&
      effectiveStage !== LevelStage.BASEMENT_1 &&
      effectiveStage !== LevelStage.DEPTHS_2 &&
      effectiveStage < LevelStage.WOMB_2 &&
      !onRepentanceStage()
    );
  }
}
