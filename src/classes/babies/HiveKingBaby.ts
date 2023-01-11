import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Giant cell effect on room clear. */
export class HiveKingBaby extends Baby {
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    let gaveGiantCell = false;
    if (!g.p.HasCollectible(CollectibleType.GIANT_CELL)) {
      g.p.AddCollectible(CollectibleType.GIANT_CELL, 0, false);
      gaveGiantCell = true;
    }

    useActiveItemTemp(g.p, CollectibleType.DULL_RAZOR);

    if (gaveGiantCell) {
      g.p.RemoveCollectible(CollectibleType.GIANT_CELL);
    }

    return undefined;
  }
}
