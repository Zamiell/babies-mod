import {
  CollectibleType,
  EntityType,
  FamiliarVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, removeAllMatchingEntities } from "isaacscript-common";
import { getBabyPlayerFromEntity } from "../../../utils";
import { Baby } from "../../Baby";

/** Shoots Blue Flies + flight. */
export class RottenBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    // C Section reduces the tear rate for no additional tears unlike Monstro's lung. So the custom
    // effect with C Section is a straight-up downgrade.
    return !player.HasCollectible(CollectibleType.C_SECTION);
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
