import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { FADED_YELLOW } from "../../constants";
import { setTearColor } from "../../utils";
import { Baby } from "../Baby";

/** Spray tears. */
export class CapeBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const angleModifier = math.random(0, 90) - 45;
    tear.Velocity = tear.Velocity.Rotated(angleModifier);
    setTearColor(tear, FADED_YELLOW);
  }
}