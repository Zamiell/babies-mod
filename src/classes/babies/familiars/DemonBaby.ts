import {
  ItemPoolType,
  ModCallback,
  PickupPrice,
  PickupVariant,
} from "isaac-typescript-definitions";
import { Callback, onStageWithNaturalDevilRoom } from "isaacscript-common";
import { mod } from "../../../mod";
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

    if (this.isPricedDevilRoomPoolCollectible(collectible)) {
      pickup.Price = PickupPrice.FREE;
      pickup.AutoUpdatePrice = false;
    }
  }

  /**
   * Detecting a priced Devil-Deal-style collectible is normally trivial because you can check for
   * if the price is less than 0 and is not `PickupPrice.YOUR_SOUL` or `PickupPrice.FREE`. However,
   * this does not work on Keeper, because all Devil-Deal-style collectibles cost money.
   * Furthermore, this does not work on Tainted Keeper, because all collectibles cost money. It also
   * fails with the Keeper's Bargain trinket for the same reason.
   *
   * This function is from Racing+.
   */
  isPricedDevilRoomPoolCollectible(
    collectible: EntityPickupCollectible,
  ): boolean {
    const itemPoolType = mod.getCollectibleItemPoolType(collectible);

    return (
      itemPoolType === ItemPoolType.DEVIL &&
      collectible.Price !== PickupPrice.NULL &&
      collectible.Price !== PickupPrice.YOUR_SOUL &&
      collectible.Price !== PickupPrice.FREE &&
      collectible.Price !== -10 // `PickupPriceCustom.PRICE_FREE_DEVIL_DEAL` from Racing+
    );
  }
}
