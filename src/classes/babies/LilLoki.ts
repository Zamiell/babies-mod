import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Cross tears. */
export class LilLoki extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    // We store the rotation angle in the "babyCounters" variable.
    g.run.babyCounters += 90;
    if (g.run.babyCounters < 360) {
      const velocity = tear.Velocity.Rotated(g.run.babyCounters);
      g.p.FireTear(g.p.Position, velocity, false, true, false);
    } else {
      g.run.babyCounters = 0;
    }
  }
}
