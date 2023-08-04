import {
  ModCallback,
  TearFlag,
  TearVariant,
} from "isaac-typescript-definitions";
import { Callback, addFlag } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Explosivo tears. */
export class OrangeDemonBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    // Only do every other tear to avoid softlocks.
    g.run.babyCounters++;
    if (g.run.babyCounters === 2) {
      g.run.babyCounters = 0;
      tear.ChangeVariant(TearVariant.EXPLOSIVO);
      tear.TearFlags = addFlag(tear.TearFlags, TearFlag.STICKY);
    }
  }
}
