import {
  CollectibleType,
  EntityType,
  FamiliarVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  hasCollectible,
  removeAllMatchingEntities,
} from "isaacscript-common";
import { getBabyPlayerFromEntity } from "../../../utils";
import { Baby } from "../../Baby";

/** Shoots Blue Flies + flight. */
export class RottenBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    /** We allow the Monstro's Lung synergy. */
    return hasCollectible(
      player,
      // Flies are not granted the +40 damage from Ipecac, resulting in a DPS downgrade.
      CollectibleType.IPECAC,
      // The custom effect with C Section is a downgrade.
      CollectibleType.C_SECTION,
    );
  }

  /** Remove all of the Blue Flies. */
  override onRemove(): void {
    removeAllMatchingEntities(EntityType.FAMILIAR, FamiliarVariant.BLUE_FLY);
  }

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    tear.Remove();
    player.AddBlueFlies(1, player.Position, undefined);
  }
}
