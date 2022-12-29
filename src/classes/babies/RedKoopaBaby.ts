import { ModCallback, TearFlag } from "isaac-typescript-definitions";
import { addFlag, Callback } from "isaacscript-common";
import { TearData } from "../../types/TearData";
import { Baby } from "../Baby";

/** Shoots bouncy & homing red shells. */
export class RedKoopaBaby extends Baby {
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
