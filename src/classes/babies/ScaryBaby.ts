import {
  CollectibleType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  asNumber,
  getCollectibleDevilHeartPrice,
  isQuestCollectible,
} from "isaacscript-common";
import { mod } from "../../mod";
import { isRerolledCollectibleBuggedHeart } from "../../utils";
import { Baby } from "../Baby";

/** Items cost hearts. */
export class ScaryBaby extends Baby {
  // 34
  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.COLLECTIBLE)
  postPickupInitCollectible(pickup: EntityPickup): void {
    const collectible = pickup as EntityPickupCollectible;
    updateCollectiblePrice(collectible);
  }

  /**
   * If the price is not correct for the collectible, update it. (We have to check on every frame in
   * case the health situation changes.)
   */
  // 35
  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.COLLECTIBLE)
  postPickupUpdateCollectible(pickup: EntityPickup): void {
    const collectible = pickup as EntityPickupCollectible;
    updateCollectiblePrice(collectible);
  }

  /**
   * Rerolled collectibles turn into hearts, so delete the heart and manually create another
   * pedestal item.
   */
  // 35
  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.HEART)
  postPickupUpdateHeart(pickup: EntityPickup): void {
    const player = Isaac.GetPlayer();

    if (isRerolledCollectibleBuggedHeart(pickup)) {
      pickup.Remove();

      const collectible = mod.spawnCollectible(
        CollectibleType.NULL,
        pickup.Position,
        pickup.InitSeed,
      );
      collectible.AutoUpdatePrice = false;
      collectible.Price = getCollectibleDevilHeartPrice(
        collectible.SubType,
        player,
      );
    }
  }
}

function updateCollectiblePrice(collectible: EntityPickupCollectible) {
  if (isQuestCollectible(collectible.SubType)) {
    return;
  }

  const player = Isaac.GetPlayer();
  const price = getCollectibleDevilHeartPrice(collectible.SubType, player);
  if (collectible.Price !== asNumber(price)) {
    collectible.AutoUpdatePrice = false;
    collectible.Price = price;
  }
}
