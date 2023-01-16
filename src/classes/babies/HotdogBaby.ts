import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  getPlayerNumHitsRemaining,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { doesBigChestExist } from "../../utils";
import { Baby } from "../Baby";

/** Constant The Bean effect + flight + explosion immunity + blindfolded. */
export class HotdogBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    const numHits = getPlayerNumHitsRemaining(player);

    if (doesBigChestExist()) {
      return;
    }

    // Prevent dying animation softlocks.
    if (numHits === 0) {
      return;
    }

    // Constant The Bean effect + flight + explosion immunity + blindfolded.
    if (gameFrameCount % 3 === 0) {
      useActiveItemTemp(player, CollectibleType.BEAN);
    }
  }
}
