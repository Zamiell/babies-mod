import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Slice tears. */
export class SlicerBaby extends Baby {
  /** Make the Soy Milk tears do extra damage. */
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.CollisionDamage = g.p.Damage * 3;
  }
}
