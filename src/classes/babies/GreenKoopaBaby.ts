import { ModCallback, TearFlag } from "isaac-typescript-definitions";
import { addFlag, Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Shoots bouncy green shells. */
export class GreenKoopaBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const sprite = tear.GetSprite();
    sprite.Load("gfx/shell_green_tears.anm2", true);
    sprite.Play("RegularTear1", false);

    tear.TearFlags = addFlag(
      TearFlag.BOUNCE, // 1 << 19
      TearFlag.POP, // 1 << 58
    );

    tear.Height = -5; // Make it lower to the ground.
    tear.SubType = 1; // Mark it as a special tear so that we can keep it updated.

    // Store the initial height and velocity.
    const data = tear.GetData();
    data["Height"] = tear.Height;
    data["Velocity"] = tear.Velocity;
  }
}
