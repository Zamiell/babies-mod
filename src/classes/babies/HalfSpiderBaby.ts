import { CollectibleType } from "isaac-typescript-definitions";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with 3x Pretty Fly. */
export class HalfSpiderBaby extends Baby {
  /**
   * Only one Pretty Fly is removed after removing a Halo of Flies. Thus, after removing 2x Halo of
   * Flies, one fly remains.
   */
  override onRemove(): void {
    g.p.RemoveCollectible(CollectibleType.HALO_OF_FLIES);
  }
}
