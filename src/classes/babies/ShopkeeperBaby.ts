import { LevelStage } from "isaac-typescript-definitions";
import { getEffectiveStage } from "isaacscript-common";
import { Baby } from "../Baby";

/** Free shop items. */
export class ShopkeeperBaby extends Baby {
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage <= LevelStage.DEPTHS_2;
  }
}
