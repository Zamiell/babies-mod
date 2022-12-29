import {
  ModCallback,
  TearFlag,
  TearVariant,
} from "isaac-typescript-definitions";
import { addFlag, Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

export class BloatBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  private postFireTear(tear: EntityTear): void {
    const num = this.getAttribute("num");

    g.run.babyCounters++;
    if (g.run.babyCounters === num) {
      g.run.babyCounters = 0;
      tear.ChangeVariant(TearVariant.NEEDLE);
      tear.TearFlags = addFlag(tear.TearFlags, TearFlag.NEEDLE);
    }
  }
}
