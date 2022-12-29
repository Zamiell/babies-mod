import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getRandomInt } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Shoots extra tears with random velocity. */
export class CockeyedBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    if (g.run.babyBool) {
      return;
    }

    // Spawn a new tear with a random velocity.
    const rng = tear.GetDropRNG();
    const rotation = getRandomInt(0, 359, rng);
    const velocity = tear.Velocity.Rotated(rotation);
    g.run.babyBool = true;
    g.p.FireTear(g.p.Position, velocity, false, true, false);
    g.run.babyBool = false;
  }
}
