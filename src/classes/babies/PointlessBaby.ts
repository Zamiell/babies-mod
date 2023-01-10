import { LevelStage } from "isaac-typescript-definitions";
import { getEffectiveStage } from "isaacscript-common";
import { Baby } from "../Baby";

/** Items are replaced with 6 cards. */
export class PointlessBaby extends Baby {
  /**
   * - Ban it on the first floor so that it does not conflict with resetting for a Treasure Room
   *   item.
   * - Ban it on the second floor so that it does not conflict with the first devil deal.
   */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return (
      effectiveStage !== LevelStage.BASEMENT_1 &&
      effectiveStage !== LevelStage.BASEMENT_2
    );
  }
}
