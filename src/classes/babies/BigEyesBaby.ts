import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

/** Tears cause self-knockback. */
export class BigEyesBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    const knockbackVelocity = tear.Velocity.mul(-0.75);
    player.Velocity = player.Velocity.add(knockbackVelocity);
  }
}
