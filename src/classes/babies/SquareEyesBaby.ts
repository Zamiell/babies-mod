import { ModCallback, TearFlag } from "isaac-typescript-definitions";
import { addFlag, Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Square tears. */
export class SquareEyesBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.SQUARE);
  }
}
