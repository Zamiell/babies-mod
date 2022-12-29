import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** All direction tears. */
export class AetherBaby extends Baby {
  /** Shoot 8 tears at a time. (We store the rotation angle inside the "babyCounters" variable.) */
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    g.run.babyCounters += 45;
    if (g.run.babyCounters < 360) {
      const velocity = tear.Velocity.Rotated(g.run.babyCounters);
      g.p.FireTear(g.p.Position, velocity, false, true, false);
    } else {
      g.run.babyCounters = 0;
    }
  }
}
