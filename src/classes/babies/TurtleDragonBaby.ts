import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getPlayerFromEntity } from "isaacscript-common";
import { Baby } from "../Baby";

/** Fiery tears. */
export class TurtleDragonBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    // If we use the base tear's velocity, the fires have enormous speed and are hard to control.
    tear.Remove();
    const normalizedVelocity = tear.Velocity.Normalized();
    player.ShootRedCandle(normalizedVelocity);
  }
}
