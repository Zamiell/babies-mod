import {
  ModCallback,
  PickupPrice,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  asNumber,
  inRoomType,
  levelHasRoomType,
} from "isaacscript-common";
import { Baby } from "../Baby";

/**
 * Free shop items.
 *
 * We have to use both the `POST_PICKUP_INIT` and the `POST_PICKUP_UPDATE` callbacks because the
 * price of rerolled items is `PickupPrice.NULL` in `POST_PICKUP_INIT`.
 */
export class ShopkeeperBaby extends Baby {
  override isValid(): boolean {
    return levelHasRoomType(RoomType.SHOP);
  }

  @Callback(ModCallback.POST_PICKUP_INIT)
  postPickupInit(pickup: EntityPickup): void {
    this.makePickupFree(pickup);
  }

  @Callback(ModCallback.POST_PICKUP_UPDATE)
  postPickupUpdate(pickup: EntityPickup): void {
    this.makePickupFree(pickup);
  }

  makePickupFree(pickup: EntityPickup): void {
    if (
      pickup.Price !== asNumber(PickupPrice.NULL) &&
      pickup.Price !== asNumber(PickupPrice.YOUR_SOUL) &&
      pickup.Price !== asNumber(PickupPrice.FREE) &&
      inRoomType(RoomType.SHOP, RoomType.ERROR)
    ) {
      pickup.Price = PickupPrice.FREE;
      pickup.AutoUpdatePrice = false;
    }
  }
}
