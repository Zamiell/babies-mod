import { ModCallback, TearVariant } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Razor blade tears. */
export class ArcadeBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    // Changing the variant does not actually increase the damage, only the appearance.
    tear.ChangeVariant(TearVariant.RAZOR);
    tear.CollisionDamage = g.p.Damage * 3;
  }
}
