import {
  CollectibleType,
  ModCallback,
  TearFlag,
} from "isaac-typescript-definitions";
import {
  Callback,
  GAME_FRAMES_PER_SECOND,
  addFlag,
  hasCollectible,
} from "isaacscript-common";
import { Baby } from "../Baby";

interface TearData {
  height: int;
  velocity: Vector;
}

export const SHELL_ANTI_SYNERGY_COLLECTIBLES = [
  CollectibleType.IPECAC, // 149
  CollectibleType.C_SECTION, // 678
] as const;

const v = {
  room: {
    shellTears: new Map<PtrHash, TearData>(),
  },
};

/** Shoots bouncy green shells. */
export class GreenKoopaBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(player, ...SHELL_ANTI_SYNERGY_COLLECTIBLES);
  }

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    const tearData = v.room.shellTears.get(ptrHash);
    if (tearData === undefined) {
      return;
    }

    const num = this.getAttribute("num");
    if (tear.FrameCount >= num * GAME_FRAMES_PER_SECOND) {
      // The tear has lived long enough, so manually kill it.
      tear.Remove();
      return;
    }

    // If the tear bounced, then we need to update the stored velocity to the new velocity.
    // (`EntityTear.Bounce` does not ever seem to go to true, so we can't use that.)
    if (
      (tear.Velocity.X > 0 && tearData.velocity.X < 0) ||
      (tear.Velocity.X < 0 && tearData.velocity.X > 0) ||
      (tear.Velocity.Y > 0 && tearData.velocity.Y < 0) ||
      (tear.Velocity.Y < 0 && tearData.velocity.Y > 0)
    ) {
      tearData.velocity = tear.Velocity;
    }

    // Continue to apply the initial tear conditions for the duration of the tear.
    tear.Height = tearData.height;
    tear.Velocity = tearData.velocity;
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

    // Make it lower to the ground.
    tear.Height = -5;

    const ptrHash = GetPtrHash(tear);
    const tearData: TearData = {
      height: tear.Height,
      velocity: tear.Velocity,
    };
    v.room.shellTears.set(ptrHash, tearData);
  }
}
