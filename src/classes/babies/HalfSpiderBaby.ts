import { CollectibleType } from "isaac-typescript-definitions";
import { Baby } from "../Baby";

/** Starts with 3x Pretty Fly. */
export class HalfSpiderBaby extends Baby {
  /**
   * Only one Pretty Fly is removed after removing a Halo of Flies. Thus, after removing 2x Halo of
   * Flies, one fly remains.
   */
  override onRemove(player: EntityPlayer): void {
    player.RemoveCollectible(
      CollectibleType.HALO_OF_FLIES,
      undefined,
      undefined,
      false,
    );
  }
}
