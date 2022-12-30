import { ModCallback } from "isaac-typescript-definitions";
import { Callback, game } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Dies 1 minute after getting hit. */
export class ScoreboardBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();

    if (g.run.babyCounters !== 0) {
      const remainingTime = g.run.babyCounters - gameFrameCount;
      if (remainingTime <= 0) {
        g.run.babyCounters = 0;
        g.p.Kill();
      }
    }
  }
}
