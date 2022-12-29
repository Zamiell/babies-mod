import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Fiery tears. */
export class TurtleDragonBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    // If we use the base tear's velocity, the fires have enormous speed and are hard to control.
    tear.Remove();
    const normalizedVelocity = tear.Velocity.Normalized();
    g.p.ShootRedCandle(normalizedVelocity);
  }
}
