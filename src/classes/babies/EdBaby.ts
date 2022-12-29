import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Fire trail tears. */
export class SquareEyesBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    // Mark that we shot this tear.
    tear.SubType = 1;
  }
}
