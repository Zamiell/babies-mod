import { CollectibleType } from "isaac-typescript-definitions";
import { Baby } from "../Baby";

/** Starts with 3x Cain's Other Eye + Friendship Necklace. */
export class N3EyesBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return (
      !player.HasCollectible(CollectibleType.IPECAC) &&
      !player.HasCollectible(CollectibleType.DR_FETUS)
    );
  }
}
