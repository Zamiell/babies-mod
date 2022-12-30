import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Constant Telekinesis effect. */
export class AwakenBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    everyNSeconds(() => {
      useActiveItemTemp(g.p, CollectibleType.TELEKINESIS);
    }, 1);
  }
}
