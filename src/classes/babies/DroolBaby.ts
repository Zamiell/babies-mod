import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, game, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with Monstro's Tooth (improved). */
export class DroolBaby extends Baby {
  // 1
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

  /** Summon extra Monstro's, spaced apart. */
  // 3
  @Callback(ModCallback.POST_USE_ITEM, CollectibleType.MONSTROS_TOOTH)
  postUseItemMonstrosTooth(): boolean | undefined {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    g.run.babyCounters++;
    if (g.run.babyCounters === num) {
      g.run.babyCounters = 0;
      g.run.babyFrame = 0;
    } else {
      g.run.babyFrame = gameFrameCount + 15;
    }

    return undefined;
  }
}
