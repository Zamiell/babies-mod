import {
  LevelStage,
  ModCallback,
  PickupPrice,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  onEffectiveStage,
  onStageWithNaturalDevilRoom,
} from "isaacscript-common";
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
    /**
     * We prevent the baby on Basement 2 so that the effect does not interfere with the Racing+ free
     * devil deal mechanic.
     */
    return (
      onStageWithNaturalDevilRoom() && !onEffectiveStage(LevelStage.BASEMENT_2)
    );
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
