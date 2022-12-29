import { ModCallback, TearFlag } from "isaac-typescript-definitions";
import { addFlag, Callback, COLORS } from "isaacscript-common";
import { setTearColor } from "../../utils";
import { Baby } from "../Baby";

/** Acid tears. */
export class ImpBaby2 extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.ACID);
    setTearColor(tear, COLORS.Yellow);
  }
}
