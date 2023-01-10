import { LevelStage } from "isaac-typescript-definitions";
import { getEffectiveStage } from "isaacscript-common";
import { Baby } from "../Baby";

/** Everything is Red Poop. */
export class ChompersBaby extends Baby {
  /** There are almost no grid entities on the final floor. */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage !== LevelStage.DARK_ROOM_CHEST;
  }
}
