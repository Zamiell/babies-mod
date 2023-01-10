import { LevelStage } from "isaac-typescript-definitions";
import { getEffectiveStage } from "isaacscript-common";
import { Baby } from "../Baby";

/** 50% chance for bombs to have the D6 effect. */
export class BombBaby extends Baby {
  /** There are no items on Cathedral. */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage !== LevelStage.SHEOL_CATHEDRAL;
  }
}
