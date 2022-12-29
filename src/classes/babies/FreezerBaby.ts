import { ModCallback, TearFlag } from "isaac-typescript-definitions";
import { addFlag, Callback } from "isaacscript-common";
import { FADED_BLUE } from "../../constants";
import { setTearColor } from "../../utils";
import { Baby } from "../Baby";

/** Ice tears. */
export class FreezerBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.ICE);
    setTearColor(tear, FADED_BLUE);
  }
}
