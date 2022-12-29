import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../classes/Baby";
import g from "../globals";

/** Shoots a Blue Spider every 2nd tear. */
export class SpiderBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  private postFireTear(tear: EntityTear) {
    g.run.babyCounters++;
    if (g.run.babyCounters === 2) {
      g.run.babyCounters = 0;

      g.p.ThrowBlueSpider(g.p.Position, g.p.Position);
      tear.Remove();
    }
  }
}
