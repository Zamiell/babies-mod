import { ModCallback, TearFlag } from "isaac-typescript-definitions";
import { Callback, GAME_FRAMES_PER_SECOND, addFlag } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  room: {
    shellTearHeights: new Map<PtrHash, float>(),
  },
};

/** Shoots bouncy & homing red shells. */
export class RedKoopaBaby extends Baby {
  v = v;

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    const height = v.room.shellTearHeights.get(ptrHash);
    if (height === undefined) {
      return;
    }

    const num = this.getAttribute("num");
    if (tear.FrameCount >= num * GAME_FRAMES_PER_SECOND) {
      // The tear has lived long enough, so manually kill it.
      tear.Remove();
      return;
    }

    // Continue to apply the initial tear conditions for the duration of the tear.
    tear.Height = height;

    // However, we can't apply a static velocity or else the shells won't home.
    tear.Velocity = tear.Velocity.Normalized();
    tear.Velocity = tear.Velocity.mul(10);
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

    // Make it lower to the ground.
    tear.Height = -5;

    // Store the initial height.
    const ptrHash = GetPtrHash(tear);
    v.room.shellTearHeights.set(ptrHash, tear.Height);
  }
}
