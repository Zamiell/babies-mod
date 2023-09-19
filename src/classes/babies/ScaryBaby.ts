import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import {
  Callback,
  getCollectibleDevilHeartPrice,
  isQuestCollectible,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Items cost hearts. */
export class ScaryBaby extends Baby {
  // 34, 100
  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.COLLECTIBLE)
  postPickupInitCollectible(pickup: EntityPickup): void {
    const collectible = pickup as EntityPickupCollectible;

    if (isQuestCollectible(collectible)) {
      return;
    }

    const player = Isaac.GetPlayer();
    collectible.Price = getCollectibleDevilHeartPrice(
      collectible.SubType,
      player,
    );

    // Setting the shop item ID in this way ensures that the rerolled item will also cost hearts:
    // https://wofsauge.github.io/IsaacDocs/rep/EntityPickup.html?h=shopitemid#shopitemid
    collectible.ShopItemId = -2;
  }
}
