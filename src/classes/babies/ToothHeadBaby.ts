import { ModCallback, TearVariant } from "isaac-typescript-definitions";
import { Callback, getPlayerFromEntity } from "isaacscript-common";
import { Baby } from "../Baby";

/** Tooth tears. */
export class ToothHeadBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    // Changing the variant does not actually increase the damage, only the appearance.
    tear.ChangeVariant(TearVariant.TOOTH);
    tear.CollisionDamage = player.Damage * 3.2;
  }
}
