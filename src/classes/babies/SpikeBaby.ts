import { TrinketType } from "isaac-typescript-definitions";
import { Baby } from "../Baby";

/** All chests are Mimics + all chests have items. */
export class SpikeBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasTrinket(TrinketType.LEFT_HAND);
  }
}
