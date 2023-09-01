import { onStageWithNaturalDevilRoom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Duality. */
export class StatueBaby extends Baby {
  /** Only valid for floors with Devil Rooms. */
  override isValid(): boolean {
    return onStageWithNaturalDevilRoom();
  }
}
