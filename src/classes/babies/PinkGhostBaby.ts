import { ModCallback, TearFlag } from "isaac-typescript-definitions";
import { addFlag, Callback } from "isaacscript-common";
import { setTearColor } from "../../utils";
import { Baby } from "../Baby";

const HOT_PINK = Color(2, 0.05, 1, 0.7, 1, 1, 1);

/** Charm tears. */
export class PinkGhostBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    setTearColor(tear, HOT_PINK);
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.CHARM);
  }
}
