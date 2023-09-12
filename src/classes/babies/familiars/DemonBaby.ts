import {
  ModCallback,
  PickupPrice,
  PickupVariant,
} from "isaac-typescript-definitions";
import { Callback, onStageWithNaturalDevilRoom } from "isaacscript-common";
import { isPricedDevilRoomPoolCollectible } from "../../../utils";
import { Baby } from "../../Baby";

/**
 * Free devil deals.
 *
 * We use both the `POST_PICKUP_INIT` and the `POST_PICKUP_UPDATE` callback so that we can handle
 * rerolls.
 */
export class DemonBaby extends Baby {
  override isValid(): boolean {
    return onStageWithNaturalDevilRoom();
  }

  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.COLLECTIBLE)
  postPickupInitCollectible(pickup: EntityPickup): void {
    this.checkSetPrice(pickup);
  }

  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.COLLECTIBLE)
  postPickupUpdateCollectible(pickup: EntityPickup): void {
    this.checkSetPrice(pickup);
  }

  checkSetPrice(pickup: EntityPickup): void {
    const collectible = pickup as EntityPickupCollectible;

    if (isPricedDevilRoomPoolCollectible(collectible)) {
      pickup.Price = PickupPrice.FREE;
      pickup.AutoUpdatePrice = false;
    }
  }
}
