import { ModCallback, TearVariant } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

/** Razor blade tears. */
export class ArcadeBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    // Changing the variant does not actually increase the damage, only the appearance.
    tear.ChangeVariant(TearVariant.RAZOR);
    tear.CollisionDamage = player.Damage * 3;
  }
}
