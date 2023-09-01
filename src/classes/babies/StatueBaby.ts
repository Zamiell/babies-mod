import { onStageWithNaturalDevilRoom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Duality. */
export class StatueBaby extends Baby {
  override isValid(): boolean {
    return onStageWithNaturalDevilRoom();
  }
}
