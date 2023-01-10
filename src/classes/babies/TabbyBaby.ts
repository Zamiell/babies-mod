import { CollectibleType } from "isaac-typescript-definitions";
import { Baby } from "../Baby";

/** Starts with Gello. */
export class TabbyBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.MOMS_KNIFE);
  }
}
