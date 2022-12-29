import { ModCallback, TearFlag } from "isaac-typescript-definitions";
import { addFlag, Callback } from "isaacscript-common";
import { FADED_BLUE } from "../../constants";
import { Baby } from "../Baby";

/** Freeze tears. */
export class ColdBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.FREEZE);
    tear.SetColor(FADED_BLUE, 10000, 10000, false, false);
  }
}
