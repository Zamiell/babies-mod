import {
  EntityType,
  FamiliarVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  getPlayerFromEntity,
  removeAllMatchingEntities,
} from "isaacscript-common";
import { Baby } from "../../Baby";

/** Shoots Blue Flies + flight. */
export class RottenBaby extends Baby {
  /** Remove all of the Blue Flies. */
  override onRemove(): void {
    removeAllMatchingEntities(EntityType.FAMILIAR, FamiliarVariant.BLUE_FLY);
  }

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    tear.Remove();
    player.AddBlueFlies(1, player.Position, undefined);
  }
}
