import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { setTearColor } from "../../utils";
import { Baby } from "../Baby";

const LIGHT_CYAN = Color(0.7, 1.5, 2, 0.7, 1, 1, 1);

/** Splash tears. */
export class GillsBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    setTearColor(tear, LIGHT_CYAN);
    tear.SubType = 1; // Mark that we shot this tear.
  }
}
