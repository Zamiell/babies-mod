import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import { Callback, hasTrinket, isChest, spawnPickup } from "isaacscript-common";
import { CHEST_ANTI_SYNERGY_TRINKET_TYPES } from "../../constantsTrinketTypes";
import { Baby } from "../Baby";

/** All chests are Old Chests. */
export class NinkumpoopBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !hasTrinket(player, ...CHEST_ANTI_SYNERGY_TRINKET_TYPES);
  }

  /**
   * Replace all chests with Mimics. This does not work in the `POST_PICKUP_SELECTION` callback
   * because the chest will not initialize properly for some reason.
   */
  // 34
  @Callback(ModCallback.POST_PICKUP_INIT)
  postPickupInit(pickup: EntityPickup): void {
    if (isChest(pickup) && pickup.Variant !== PickupVariant.OLD_CHEST) {
      pickup.Remove();
      spawnPickup(
        PickupVariant.OLD_CHEST,
        0,
        pickup.Position,
        pickup.Velocity,
        pickup.Parent,
        pickup.InitSeed,
      );
    }
  }
}
