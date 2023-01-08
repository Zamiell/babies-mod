import {
  ModCallback,
  PillColor,
  PillEffect,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../../globals";
import { isValidForMissingTearsEffect } from "../../../utils";
import { Baby } from "../../Baby";

/** Every Nth missed tear causes paralysis. */
export class Abel extends Baby {
  override isValid(): boolean {
    return isValidForMissingTearsEffect();
  }

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const num = this.getAttribute("num");

    if (
      tear.SubType === 1 &&
      // Tears will not die if they hit an enemy, but they will die if they hit a wall or object.
      tear.IsDead()
    ) {
      // The baby effect only applies to the Nth missed tear.
      g.run.babyCounters++;
      if (g.run.babyCounters === num) {
        g.run.babyCounters = 0;
        g.p.UsePill(PillEffect.PARALYSIS, PillColor.NULL);
        // (We can't cancel the animation or it will cause a bug where the player cannot pick up
        // pedestal items.)
      }
    }
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.SubType = 1; // Mark that we shot this tear.
  }
}
