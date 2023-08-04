import { ModCallback, TearFlag } from "isaac-typescript-definitions";
import { Callback, GAME_FRAMES_PER_SECOND, addFlag } from "isaacscript-common";
import type { TearData } from "../../types/TearData";
import { Baby } from "../Baby";

/** Shoots bouncy green shells. */
export class GreenKoopaBaby extends Baby {
  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    if (tear.SubType !== 1) {
      return;
    }

    const num = this.getAttribute("num");

    if (tear.FrameCount <= num * GAME_FRAMES_PER_SECOND) {
      // The `POST_TEAR_UPDATE` callback will fire before the `POST_FIRE_TEAR` callback, so do
      // nothing if we are in on the first frame.
      const data = tear.GetData() as unknown as TearData;
      if (
        data.BabiesModHeight === undefined ||
        data.BabiesModVelocity === undefined
      ) {
        return;
      }

      // If the tear bounced, then we need to update the stored velocity to the new velocity.
      // ("tear.Bounce" does not ever seem to go to true, so we can't use that.)
      if (
        (tear.Velocity.X > 0 && data.BabiesModVelocity.X < 0) ||
        (tear.Velocity.X < 0 && data.BabiesModVelocity.X > 0) ||
        (tear.Velocity.Y > 0 && data.BabiesModVelocity.Y < 0) ||
        (tear.Velocity.Y < 0 && data.BabiesModVelocity.Y > 0)
      ) {
        data.BabiesModVelocity = tear.Velocity;
      }

      // Continue to apply the initial tear conditions for the duration of the tear.
      tear.Height = data.BabiesModHeight;
      tear.Velocity = data.BabiesModVelocity;
    } else {
      // The tear has lived long enough, so manually kill it.
      tear.Remove();
    }
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const sprite = tear.GetSprite();
    sprite.Load("gfx/shell_green_tears.anm2", true);
    sprite.Play("RegularTear1", false);

    // Make it bouncy and homing.
    tear.TearFlags = addFlag(
      TearFlag.BOUNCE, // 1 << 19
      TearFlag.POP, // 1 << 58
    );

    tear.Height = -5; // Make it lower to the ground.
    tear.SubType = 1; // Mark it as a special tear so that we can keep it updated.

    // Store the initial height and velocity.
    const data = tear.GetData() as unknown as TearData;
    data.BabiesModHeight = tear.Height;
    data.BabiesModVelocity = tear.Velocity;
  }
}
