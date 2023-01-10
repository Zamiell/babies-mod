import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Slice tears. */
export class SlicerBaby extends Baby {
  /** Ipecac causes the tears to explode instantly, which causes unavoidable damage. */
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.IPECAC);
  }

  /** Make the Soy Milk tears do extra damage. */
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.CollisionDamage = g.p.Damage * 3;
  }
}
