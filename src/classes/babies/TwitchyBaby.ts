import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback, game } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Tear rate oscillates. */
export class TwitchyBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");
    const max = this.getAttribute("max");
    const min = this.getAttribute("min");

    if (gameFrameCount >= g.run.babyFrame) {
      g.run.babyFrame += num;
      if (g.run.babyBool) {
        // Tear rate is increasing.
        g.run.babyCounters++;
        if (g.run.babyCounters === max) {
          g.run.babyBool = false;
        }
      } else {
        // Tear rate is decreasing.
        g.run.babyCounters--;
        if (g.run.babyCounters === min) {
          g.run.babyBool = true;
        }
      }

      g.p.AddCacheFlags(CacheFlag.FIRE_DELAY);
      g.p.EvaluateItems();
    }
  }
}
