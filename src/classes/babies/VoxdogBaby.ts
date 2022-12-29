import { ModCallback } from "isaac-typescript-definitions";
import { Callback, game } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Shockwave tears. */
export class VoxdogBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const gameFrameCount = game.GetFrameCount();

    tear.Remove();

    g.run.room.tears.push({
      frame: gameFrameCount,
      position: tear.Position,
      velocity: tear.Velocity.Normalized().mul(30),
      num: 0,
    });
  }
}
