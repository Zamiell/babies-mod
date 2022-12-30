import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, game, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with Brown Nugget (improved). */
export class PizzaBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    if (g.run.babyFrame !== 0 && gameFrameCount >= g.run.babyFrame) {
      g.run.babyCounters++;
      g.run.babyFrame = gameFrameCount + num;
      useActiveItemTemp(g.p, CollectibleType.BROWN_NUGGET);
      if (g.run.babyCounters === 19) {
        // One is already spawned with the initial trigger.
        g.run.babyCounters = 0;
        g.run.babyFrame = 0;
      }
    }
  }
}
