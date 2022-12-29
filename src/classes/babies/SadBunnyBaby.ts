import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Accuracy increases tear rate. */
export class SadBunnyBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.SubType = 1; // Mark that we shot this tear.
  }
}
