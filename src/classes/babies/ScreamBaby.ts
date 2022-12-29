import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Shoop tears. */
export class ScreamBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.Remove();
    useActiveItemTemp(g.p, CollectibleType.SHOOP_DA_WHOOP);
  }
}
