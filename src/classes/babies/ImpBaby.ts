import { ModCallback } from "isaac-typescript-definitions";
import { Callback, game } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Blender + flight + explosion immunity + blindfolded. */
export class ImpBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    // If we rotate the knives on every frame, then it spins too fast.
    if (gameFrameCount < g.run.babyFrame) {
      return;
    }

    g.run.babyFrame += num;

    // Rotate through the four directions.
    g.run.babyCounters++;
    if (g.run.babyCounters >= 8) {
      g.run.babyCounters = 4;
    }
  }
}
