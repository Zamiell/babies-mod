import { ModCallback } from "isaac-typescript-definitions";
import { Callback, game } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Kamikaze effect upon touching a breakable obstacle. */
export class ExplodingBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();

    // Check to see if we need to reset the cooldown (after we used the Kamikaze effect upon
    // touching an obstacle).
    if (g.run.babyFrame !== 0 && gameFrameCount >= g.run.babyFrame) {
      g.run.babyFrame = 0;
    }
  }
}
