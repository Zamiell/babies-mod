import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getPlayerFromEntity } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Shoots 4 tears diagonally. */
export class XBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    g.run.babyCounters++;
    tear.Velocity = tear.Velocity.Rotated(45);
    if (g.run.babyCounters < 4) {
      const newVelocity = tear.Velocity.Rotated(45);
      player.FireTear(player.Position, newVelocity, false, true, false);
    } else {
      g.run.babyCounters = 0;
    }
  }
}
