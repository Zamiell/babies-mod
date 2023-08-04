import { ModCallback, TearFlag } from "isaac-typescript-definitions";
import { Callback, addFlag } from "isaacscript-common";
import { FADED_RED } from "../../constants";
import { setTearColor } from "../../utils";
import { Baby } from "../Baby";

/** Tomato tears. */
export class RefereeBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.BAIT);
    setTearColor(tear, FADED_RED);
  }
}
