import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Tears cause self-knockback. */
export class BigEyesBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const knockbackVelocity = tear.Velocity.mul(-0.75);
    g.p.Velocity = g.p.Velocity.add(knockbackVelocity);
  }
}
