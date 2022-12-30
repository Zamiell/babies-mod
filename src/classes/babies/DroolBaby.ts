import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, game, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with Monstro's Tooth (improved). */
export class DroolBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const roomClear = g.r.IsClear();

    if (g.run.babyFrame !== 0 && gameFrameCount >= g.run.babyFrame) {
      if (roomClear) {
        // The room might have been cleared since the initial Monstro's Tooth activation If so,
        // cancel the remaining Monstro's.
        g.run.babyCounters = 0;
        g.run.babyFrame = 0;
      } else {
        useActiveItemTemp(g.p, CollectibleType.MONSTROS_TOOTH);
      }
    }
  }
}
