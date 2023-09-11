import {
  CollectibleType,
  ModCallback,
  PickupPrice,
  PickupVariant,
  PlayerType,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  anyPlayerHasCollectible,
  anyPlayerIs,
  asNumber,
  inRoomType,
  onStageWithNaturalDevilRoom,
} from "isaacscript-common";
import { Baby } from "../../Baby";

/** Free devil deals. */
export class DemonBaby extends Baby {
  override isValid(): boolean {
    return onStageWithNaturalDevilRoom();
  }

  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.COLLECTIBLE)
  postPickupInitCollectible(pickup: EntityPickup): void {
    if (
      pickup.Price < asNumber(PickupPrice.NULL) &&
      pickup.Price !== asNumber(PickupPrice.YOUR_SOUL) &&
      pickup.Price !== asNumber(PickupPrice.FREE)
    ) {
      pickup.Price = PickupPrice.FREE;
      pickup.AutoUpdatePrice = false;
    }
  }

  /**
   * Detecting a Devil-Deal-style collectible is normally trivial because you can check for if the
   * price is less than 0 and is not `PickupPrice.YOUR_SOUL` or `PickupPrice.FREE`. However, this
   * does not work on Keeper, because all Devil-Deal-style collectibles cost money. Furthermore, it
   * does not work on Tainted Keeper, because all collectibles cost money. It also fails with shop
   * items.
   *
   * For simplicity, this function assumes that every collectible in a Devil Room or Black Market
   * Keeper is a Devil-Deal-style collectible for Keeper and Tainted Keeper. This is not necessarily
   * true, as Keeper could use Satanic Bible and get a Devil-Deal-style item in a Boss Room, for
   * example.
   */
  isDevilDealStyleCollectible(collectible: EntityPickupCollectible): boolean {
    if (anyPlayerIs(PlayerType.KEEPER, PlayerType.KEEPER_B)) {
      return (
        collectible.Price > 0 &&
        inRoomType(RoomType.DEVIL, RoomType.BLACK_MARKET)
      );
    }

    // Handle the special case of collectibles with A Pound of Flesh.
    if (anyPlayerHasCollectible(CollectibleType.POUND_OF_FLESH)) {
      // For the context of this function, shop items with A Pound of Flesh do not count as devil
      // deal style collectibles because they do not increase the return value from the
      // `Game.GetDevilRoomDeals` method. (Black Market items are not affected by A Pound of Flesh.)
      if (inRoomType(RoomType.SHOP)) {
        return false;
      }

      if (inRoomType(RoomType.DEVIL)) {
        return collectible.Price > 0;
      }
    }

    return (
      collectible.Price < 0 &&
      collectible.Price !== asNumber(PickupPrice.YOUR_SOUL) &&
      collectible.Price !== asNumber(PickupPrice.FREE)
    );
  }
}
