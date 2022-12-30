import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  game,
  getPlayerNumHitsRemaining,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { bigChestExists } from "../../utils";
import { Baby } from "../Baby";

/** Constant The Bean effect + flight + explosion immunity + blindfolded. */
export class HotdogBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const numHits = getPlayerNumHitsRemaining(g.p);

    if (bigChestExists()) {
      return;
    }

    // Prevent dying animation softlocks.
    if (numHits === 0) {
      return;
    }

    // Constant The Bean effect + flight + explosion immunity + blindfolded.
    if (gameFrameCount % 3 === 0) {
      useActiveItemTemp(g.p, CollectibleType.BEAN);
    }
  }
}
