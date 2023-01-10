import {
  ItemPoolType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  getCollectibleDevilHeartPrice,
  isQuestCollectible,
} from "isaacscript-common";
import { g } from "../../globals";
import { mod } from "../../mod";
import {
  getRandomCollectibleTypeFromPool,
  isRerolledCollectibleBuggedHeart,
  shouldTransformRoomType,
} from "../../utils";
import { Baby } from "../Baby";

/** All special rooms are Devil Rooms. */
export class SuitBaby extends Baby {
  // 35
  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.COLLECTIBLE)
  postPickupUpdateCollectible(pickup: EntityPickup): void {
    const collectible = pickup as EntityPickupCollectible;
    const roomType = g.r.GetType();

    if (!shouldTransformRoomType(roomType)) {
      return;
    }

    if (isQuestCollectible(collectible.SubType)) {
      return;
    }

    // If the price is not correct, update it. (We have to check on every frame in case the health
    // situation changes.)
    const price = getCollectibleDevilHeartPrice(collectible.SubType, g.p);
    if (collectible.Price !== (price as int)) {
      collectible.AutoUpdatePrice = false;
      collectible.Price = price;
    }
  }

  /**
   * Rerolled collectibles turn into hearts, so delete the heart and manually create another
   * pedestal item.
   */
  // 35
  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.HEART)
  postPickupUpdateHeart(pickup: EntityPickup): void {
    const roomType = g.r.GetType();

    if (!shouldTransformRoomType(roomType)) {
      return;
    }

    if (isRerolledCollectibleBuggedHeart(pickup)) {
      pickup.Remove();

      const collectibleType = getRandomCollectibleTypeFromPool(
        ItemPoolType.DEVIL,
      );
      const collectible = mod.spawnCollectible(
        collectibleType,
        pickup.Position,
        pickup.InitSeed,
      );
      collectible.AutoUpdatePrice = false;
      collectible.Price = 15;
    }
  }
}
