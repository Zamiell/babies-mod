import { getEffectiveStage } from "isaacscript-common";
import { Baby } from "../Baby";

/** 50% chance for bombs to have the D6 effect. */
export class BombBaby extends Baby {
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage !== 10;
  }
}
