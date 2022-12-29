import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Farts after shooting. */
export class ButtBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(): void {
    useActiveItemTemp(g.p, CollectibleType.BEAN);
  }
}
