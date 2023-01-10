import {
  LevelStage,
  ModCallback,
  PickupPrice,
  PickupVariant,
  RoomType,
} from "isaac-typescript-definitions";
import { Callback, getEffectiveStage, inRoomType } from "isaacscript-common";
import { Baby } from "../Baby";

/** Free shop items. */
export class ShopkeeperBaby extends Baby {
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage <= LevelStage.DEPTHS_2;
  }

  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.COLLECTIBLE)
  postPickupInitCollectible(pickup: EntityPickup): void {
    if (
      pickup.Price !== (PickupPrice.NULL as int) &&
      pickup.Price !== (PickupPrice.FREE as int) &&
      inRoomType(RoomType.SHOP, RoomType.ERROR)
    ) {
      pickup.Price = PickupPrice.FREE;
    }
  }
}
