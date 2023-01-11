import { DamageFlagZero, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { isValidForMissingTearsEffect } from "../../utils";
import { Baby } from "../Baby";

/** Every Nth missed tear causes damage. */
export class CursedPillowBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return isValidForMissingTearsEffect(player);
  }

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    if (
      tear.SubType !== 1 ||
      // Tears will not die if they hit an enemy, but they will die if they hit a wall or object.
      !tear.IsDead()
    ) {
      return;
    }

    const num = this.getAttribute("num");

    // It only applies to the Nth missed tear.
    g.run.babyCounters++;
    if (g.run.babyCounters === num) {
      g.run.babyCounters = 0;
      g.p.TakeDamage(1, DamageFlagZero, EntityRef(g.p), 0);
    }
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.SubType = 1; // Mark that we shot this tear.
  }
}
