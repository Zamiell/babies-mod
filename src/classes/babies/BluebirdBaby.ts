import {
  ModCallback,
  PillColor,
  PillEffect,
} from "isaac-typescript-definitions";
import { Callback, game } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Touching items/pickups causes paralysis. */
export class BluebirdBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();

    if (g.run.babyFrame !== 0 && gameFrameCount >= g.run.babyFrame) {
      g.run.babyFrame = 0;
    }

    // Touching pickups causes paralysis (1/2).
    if (!g.p.IsItemQueueEmpty() && g.run.babyFrame === 0) {
      // Using a pill does not clear the queue, so without a frame check the following code would
      // softlock the player.
      g.run.babyFrame = gameFrameCount + 45;
      g.p.UsePill(PillEffect.PARALYSIS, PillColor.NULL);
    }
  }
}
