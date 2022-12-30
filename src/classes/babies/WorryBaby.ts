import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, game, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Touching items/pickups causes teleportation. */
export class WorryBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    // Teleport 2 frames in the future so that we can put an item in the Schoolbag.
    if (g.run.babyFrame === 0 && !g.p.IsItemQueueEmpty()) {
      g.run.babyFrame = gameFrameCount + num;
    }

    if (g.run.babyFrame === 0 || gameFrameCount < g.run.babyFrame) {
      return;
    }

    g.run.babyFrame = 0;
    useActiveItemTemp(g.p, CollectibleType.TELEPORT);
  }
}
