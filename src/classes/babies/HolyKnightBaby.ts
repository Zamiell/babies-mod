import { onStageWithNaturalDevilRoom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Eucharist. */
export class HolyKnightBaby extends Baby {
  override isValid(): boolean {
    return onStageWithNaturalDevilRoom();
  }
}
