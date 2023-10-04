import { CollectibleType, FamiliarVariant } from "isaac-typescript-definitions";
import { removeAllFamiliars } from "isaacscript-common";
import { onStageWithCollectibles } from "../../utils";
import { Baby } from "../Baby";

/** Double items. */
export class OrangePigBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return (
      onStageWithCollectibles() &&
      // The Damocles passive is granted but we also want to ensure that the player does not have
      // the Damocles active.
      !player.HasCollectible(CollectibleType.DAMOCLES)
    );
  }

  override onAdd(): void {
    removeAllFamiliars(FamiliarVariant.DAMOCLES);
  }
}
