import {
  CollectibleType,
  EntityType,
  FamiliarVariant,
} from "isaac-typescript-definitions";
import { removeAllMatchingEntities } from "isaacscript-common";
import { Baby } from "../Baby";

/** Gains a explosive egg per enemy killed. */
export class DinoBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.BOBS_BRAIN);
  }

  /** Remove any leftover eggs. */
  override onRemove(): void {
    removeAllMatchingEntities(EntityType.FAMILIAR, FamiliarVariant.BOBS_BRAIN);
  }
}
