import { onStageWithNaturalDevilRoom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Eucharist. */
export class HolyKnightBaby extends Baby {
  /** Only valid for floors with Devil Rooms. */
  override isValid(): boolean {
    return onStageWithNaturalDevilRoom();
  }
}
