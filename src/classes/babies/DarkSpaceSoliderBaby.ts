import { ModCallback, TearVariant } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Chaos card tears (every 5th tear). */
export class DarkSpaceSoldierBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const num = this.getAttribute("num");

    g.run.babyCounters++;
    if (g.run.babyCounters === num) {
      g.run.babyCounters = 0;
      tear.ChangeVariant(TearVariant.CHAOS_CARD);
    }
  }
}
