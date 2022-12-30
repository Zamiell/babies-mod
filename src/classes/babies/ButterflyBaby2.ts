import {
  EntityGridCollisionClass,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Flight + can walk through walls. */
export class ButterflyBaby2 extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    g.p.GridCollisionClass = EntityGridCollisionClass.NONE;
  }
}
