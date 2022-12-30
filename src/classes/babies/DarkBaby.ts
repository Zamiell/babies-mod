import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Temporary blindness. */
export class DarkBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const num = this.getAttribute("num");

    // Make the counters tick from 0 --> max --> 0, etc.
    if (!g.run.babyBool) {
      g.run.babyCounters++;
      if (g.run.babyCounters === num) {
        g.run.babyBool = true;
      }
    } else {
      g.run.babyCounters--;
      if (g.run.babyCounters === 0) {
        g.run.babyBool = false;
      }
    }
  }
}
