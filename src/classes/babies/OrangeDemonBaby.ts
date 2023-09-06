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

/** Explosivo tears (every N tears). */
export class OrangeDemonBaby extends Baby {
  v = v;

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    // We do not apply Explosivo tears to every tear in order to avoid softlocks.
    v.run.numTearsFired++;
    if (v.run.numTearsFired === 2) {
      v.run.numTearsFired = 0;

      tear.ChangeVariant(TearVariant.EXPLOSIVO);
      tear.TearFlags = addFlag(tear.TearFlags, TearFlag.STICKY);
    }
  }
}
