import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { isValidForMissingTearsEffect } from "../../utils";
import { Baby } from "../Baby";

/** Every 4th missed tear causes damage. */
export class CursedPillowBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return isValidForMissingTearsEffect(player);
  }

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.SubType = 1; // Mark that we shot this tear.
  }
}
