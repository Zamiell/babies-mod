import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, repeat, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** 3x Keeper's Box effect on room clear. */
export class PegasusBaby extends Baby {
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    const num = this.getAttribute("num");

    repeat(num, () => {
      useActiveItemTemp(g.p, CollectibleType.KEEPERS_BOX);
    });

    return undefined;
  }
}
