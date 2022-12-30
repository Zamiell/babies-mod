import { ModCallback, TearFlag } from "isaac-typescript-definitions";
import { addFlag, Callback, GAME_FRAMES_PER_SECOND } from "isaacscript-common";
import { TearData } from "../../types/TearData";
import { Baby } from "../Baby";

/** Shoots bouncy & homing red shells. */
export class RedKoopaBaby extends Baby {
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
      if (data.BabiesModHeight === undefined) {
        return;
      }

      // Continue to apply the initial tear conditions for the duration of the tear.
      tear.Height = data.BabiesModHeight;

      // However, we can't apply a static velocity or else the shells won't home.
      tear.Velocity = tear.Velocity.Normalized();
      tear.Velocity = tear.Velocity.mul(10);
    } else {
      // The tear has lived long enough, so manually kill it.
      tear.Remove();
    }
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const sprite = tear.GetSprite();
    sprite.Load("gfx/shell_red_tears.anm2", true);
    sprite.Play("RegularTear1", false);

    // Make it bouncy and homing.
    tear.TearFlags = addFlag(
      TearFlag.HOMING, // 1 << 2
      TearFlag.BOUNCE, // 1 << 19
      TearFlag.POP, // 1 << 56
    );

    tear.Height = -5; // Make it lower to the ground.
    tear.SubType = 1; // Mark it as a special tear so that we can keep it updated.

    // Store the initial height. (Unlike Green Koopa Baby, we do not need to store the velocity.)
    const data = tear.GetData() as unknown as TearData;
    data.BabiesModHeight = tear.Height;
  }
}
