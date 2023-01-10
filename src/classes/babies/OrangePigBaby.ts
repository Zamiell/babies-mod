import { CollectibleType } from "isaac-typescript-definitions";
import { playerHasCollectible } from "isaacscript-common";
import { Baby } from "../Baby";

const NON_WORKING_COLLECTIBLE_TYPES = [
  CollectibleType.DAMOCLES, // 577
  CollectibleType.DAMOCLES_PASSIVE, // 656
] as const;

/** Double items. */
export class OrangePigBaby extends Baby {
  /** Damocles does not work properly with this mechanic. */
  override isValid(player: EntityPlayer): boolean {
    return !playerHasCollectible(player, ...NON_WORKING_COLLECTIBLE_TYPES);
  }
}
