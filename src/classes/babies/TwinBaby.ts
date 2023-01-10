import { LevelStage } from "isaac-typescript-definitions";
import { getEffectiveStage } from "isaacscript-common";
import { Baby } from "../Baby";

/** Uncontrollable Teleport 2.0. */
export class TwinBaby extends Baby {
  /** If they mess up and go past the Boss Room on Womb 2, they can get the wrong path. */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage !== (LevelStage.WOMB_2 as int);
  }
}
