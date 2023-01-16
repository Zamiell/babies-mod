import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, useActiveItemTemp } from "isaacscript-common";
import { Baby } from "../Baby";

/** Friend Finder effect on room clear. */
export class N2600Baby extends Baby {
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    const player = Isaac.GetPlayer();
    useActiveItemTemp(player, CollectibleType.FRIEND_FINDER);
    return undefined;
  }
}
