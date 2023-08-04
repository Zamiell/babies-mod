import { ModCallback, TearFlag } from "isaac-typescript-definitions";
import { Callback, addFlag } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Void tears (every 5th tear). */
export class LittleHornBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const num = this.getAttribute("num");

    g.run.babyCounters++;
    if (g.run.babyCounters === num) {
      g.run.babyCounters = 0;
      tear.TearFlags = addFlag(tear.TearFlags, TearFlag.HORN);
    }
  }
}
