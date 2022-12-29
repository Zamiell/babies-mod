import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** X splitting tears. */
export class SpeakerBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    // Mark that we shot this tear.
    if (!g.run.babyBool) {
      tear.SubType = 1;
    }
  }
}
