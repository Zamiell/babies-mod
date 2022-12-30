import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Anarchist Cookbook effect every N seconds. */
export class WrathBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      useActiveItemTemp(g.p, CollectibleType.ANARCHIST_COOKBOOK);
    }, num);
  }
}
