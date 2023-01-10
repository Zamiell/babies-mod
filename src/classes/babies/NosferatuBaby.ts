import { LevelStage } from "isaac-typescript-definitions";
import { getEffectiveStage } from "isaacscript-common";
import { Baby } from "../Baby";

/** Enemies have homing projectiles. */
export class NosferatuBaby extends Baby {
  /** This baby is too difficult for the later floors. */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage < LevelStage.WOMB_2;
  }
}
