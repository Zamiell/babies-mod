import { LevelStage } from "isaac-typescript-definitions";
import { getEffectiveStage } from "isaacscript-common";
import { Baby } from "../Baby";

/** Pennies spawn as nickels. */
export class GemBaby extends Baby {
  /** Money is useless past Depths 2. */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage <= LevelStage.DEPTHS_2;
  }
}
