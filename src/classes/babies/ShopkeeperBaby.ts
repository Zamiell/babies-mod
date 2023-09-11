import {
  ModCallback,
  PickupPrice,
  RoomType,
} from "isaac-typescript-definitions";
import { Callback, levelHasRoomType } from "isaacscript-common";
import { Baby } from "../Baby";

/**
 * Items that cost coins are free.
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
    if (pickup.Price > 0) {
      pickup.Price = PickupPrice.FREE;
      pickup.AutoUpdatePrice = false;
    }
  }

  @Callback(ModCallback.POST_PICKUP_UPDATE)
  postPickupUpdate(pickup: EntityPickup): void {
    if (pickup.Price > 0) {
      pickup.Price = PickupPrice.FREE;
      pickup.AutoUpdatePrice = false;
    }
  }
}
