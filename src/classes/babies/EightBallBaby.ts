import { ModCallback, TearFlag } from "isaac-typescript-definitions";
import { addFlag, Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Orbiting tears. */
export class EightBallBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const num = this.getAttribute("num");

    // Mark that we shot this tear.
    tear.SubType = 1;

    // We need to have spectral for this ability to work properly.
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.SPECTRAL);

    // Start with the tears directly above the player and moving towards the right.
    tear.Position = Vector(0, num * -1);
    tear.Velocity = Vector(num / 4, 0);
    tear.FallingSpeed = 0;
  }
}
