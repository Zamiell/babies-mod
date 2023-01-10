import {
  ModCallback,
  PickupPrice,
  PickupVariant,
} from "isaac-typescript-definitions";
import { Callback, getEffectiveStage } from "isaacscript-common";
import { Baby } from "../../Baby";

/** Free devil deals. */
export class DemonBaby extends Baby {
  /** Only valid for floors with Devil Rooms. */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage >= 2 && effectiveStage <= 8;
  }

  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.COLLECTIBLE)
  postPickupInitCollectible(pickup: EntityPickup): void {
    if (
      pickup.Price < 0 &&
      pickup.Price !== (PickupPrice.YOUR_SOUL as int) &&
      pickup.Price !== (PickupPrice.FREE as int)
    ) {
      pickup.Price = 0;
    }
  }
}