import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  game,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Shoots an extra tear every 3rd shot. */
export class EyemouthBaby extends Baby {
  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const gameFrameCount = game.GetFrameCount();

    g.run.babyTears.numFired++;
    if (g.run.babyTears.numFired >= 4) {
      // Mark to fire a tear 1 frame from now.
      g.run.babyTears.numFired = 0;
      g.run.babyTears.frame = gameFrameCount + 1;
      g.run.babyTears.velocity = Vector(tear.Velocity.X, tear.Velocity.Y);
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();

    if (
      g.run.babyTears.frame !== 0 &&
      gameFrameCount >= g.run.babyTears.frame
    ) {
      g.run.babyTears.frame = 0;
      player.FireTear(
        player.Position,
        g.run.babyTears.velocity,
        false,
        true,
        false,
      );
    }
  }
}
