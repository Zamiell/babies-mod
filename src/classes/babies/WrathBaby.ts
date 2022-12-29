import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, game, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Anarchist Cookbook effect every N seconds. */
export class WrathBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    if (gameFrameCount % num === 0) {
      useActiveItemTemp(g.p, CollectibleType.ANARCHIST_COOKBOOK);
    }
  }
}
