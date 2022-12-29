import {
  ModCallback,
  TearFlag,
  TearVariant,
} from "isaac-typescript-definitions";
import { addFlag, Callback } from "isaacscript-common";
import g from "../../globals";
import { getCurrentBabyDescription } from "../../utils";
import { Baby } from "../Baby";

export class BloatBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  private postFireTear(tear: EntityTear): void {
    const baby = getCurrentBabyDescription();
    if (baby.num === undefined) {
      error(`The "num" attribute was not defined for: ${baby.name}`);
    }

    g.run.babyCounters++;
    if (g.run.babyCounters === baby.num) {
      g.run.babyCounters = 0;
      tear.ChangeVariant(TearVariant.NEEDLE);
      tear.TearFlags = addFlag(tear.TearFlags, TearFlag.NEEDLE);
    }
  }
}
