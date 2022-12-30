import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, game, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Ventricle Razor effect every 15 seconds. */
export class CloudBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    if (gameFrameCount % num === 0) {
      useActiveItemTemp(g.p, CollectibleType.VENTRICLE_RAZOR);
    }
  }
}
