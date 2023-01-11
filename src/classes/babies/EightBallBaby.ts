import { ModCallback, TearFlag } from "isaac-typescript-definitions";
import { addFlag, Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Orbiting tears. */
export class EightBallBaby extends Baby {
  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    if (tear.SubType !== 1) {
      return;
    }

    const num = this.getAttribute("num");

    let positionMod = Vector(0, num * -1); // The tear starts directly above the player.
    const degrees = tear.FrameCount * 8; // Tears rotate 4 degrees per frame.
    positionMod = positionMod.Rotated(degrees);
    tear.Position = g.p.Position.add(positionMod);

    // We want the tear to be moving perpendicular to the line between the player and the tear.
    tear.Velocity = Vector(num / 4, 0);
    tear.Velocity = tear.Velocity.Rotated(degrees);

    // Keep it in the air for a while.
    if (tear.FrameCount < 150) {
      tear.FallingSpeed = 0;
    }
  }

  // 61
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
