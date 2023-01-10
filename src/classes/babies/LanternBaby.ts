import { CollectibleType } from "isaac-typescript-definitions";
import { Baby } from "../Baby";

/** Godhead aura + flight + blindfolded. */
export class LanternBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.TRISAGION);
  }
}
