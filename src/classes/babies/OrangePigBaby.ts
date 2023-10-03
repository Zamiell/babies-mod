import {
  CollectibleType,
  FamiliarVariant,
  LevelStage,
} from "isaac-typescript-definitions";
import { onStage, removeAllFamiliars } from "isaacscript-common";
import { Baby } from "../Baby";

/** Double items. */
export class OrangePigBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return (
      // The Damocles passive is granted but we also want to ensure that the player does not have
      // the Damocles active.
      !player.HasCollectible(CollectibleType.DAMOCLES) &&
      // There are no collectibles on Sheol/Cathedral.
      !onStage(LevelStage.SHEOL_CATHEDRAL)
    );
  }

  override onAdd(): void {
    removeAllFamiliars(FamiliarVariant.DAMOCLES);
  }
}
