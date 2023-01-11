import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Friend Finder effect on room clear. */
export class N2600Baby extends Baby {
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    useActiveItemTemp(g.p, CollectibleType.FRIEND_FINDER);
    return undefined;
  }
}
