import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Delirious effect every N seconds. */
export class GrayscaleBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      useActiveItemTemp(g.p, CollectibleType.DELIRIOUS);
    }, num);
  }
}
