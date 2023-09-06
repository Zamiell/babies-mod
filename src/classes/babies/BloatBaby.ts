import {
  ModCallback,
  TearFlag,
  TearVariant,
} from "isaac-typescript-definitions";
import { Callback, addFlag } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numTearsFired: 0,
  },
};

/** Syringe tears */
export class BloatBaby extends Baby {
  v = v;

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const num = this.getAttribute("num");

    v.run.numTearsFired++;
    if (v.run.numTearsFired === num) {
      v.run.numTearsFired = 0;

      tear.ChangeVariant(TearVariant.NEEDLE);
      tear.TearFlags = addFlag(tear.TearFlags, TearFlag.NEEDLE);
    }
  }
}
