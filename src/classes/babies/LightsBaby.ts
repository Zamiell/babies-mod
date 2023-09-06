import { ModCallback, TearFlag } from "isaac-typescript-definitions";
import { Callback, addFlag } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numTearsFired: 0,
  },
};

/** Holy tears. */
export class LightsBaby extends Baby {
  v = v;

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const num = this.getAttribute("num");

    v.run.numTearsFired++;
    if (v.run.numTearsFired === num) {
      v.run.numTearsFired = 0;
      tear.TearFlags = addFlag(tear.TearFlags, TearFlag.LIGHT_FROM_HEAVEN);
    }
  }
}
