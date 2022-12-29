import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Invisible tears. */
export class BlindcursedBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.Visible = false;
  }
}
