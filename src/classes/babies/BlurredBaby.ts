import { CollectibleType } from "isaac-typescript-definitions";
import { Baby } from "../Baby";

/** Starts with Ipecac + Ludo + Flat Stone. */
export class BlurredBaby extends Baby {
  /** Incubus will not fire the Ludo tears, ruining the build. */
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.INCUBUS);
  }
}
