import {
  LevelStage,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  isQuestCollectible,
  onEffectiveStage,
  onStage,
} from "isaacscript-common";
import { Baby } from "../../Baby";

/** Items cost money. */
export class FatesReward extends Baby {
  override isValid(player: EntityPlayer): boolean {
    const coins = player.GetNumCoins();

    return (
      coins >= 15 &&
      !onEffectiveStage(
        // On stage 1, the player does not have 15 cents.
        LevelStage.BASEMENT_1,
        // On stage 2, they will miss a Devil Deal, which is not fair.
        LevelStage.BASEMENT_2,
      ) &&
      !onStage(
        // On stage 10, there are no items.
        LevelStage.SHEOL_CATHEDRAL, // 10
        // On stage 11, it would be unfair to deny the four items.
        LevelStage.DARK_ROOM_CHEST, // 11
      )
    );
  }

  // 34
  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.COLLECTIBLE)
  postPickupInitCollectible(pickup: EntityPickup): void {
    const collectible = pickup as EntityPickupCollectible;

    if (isQuestCollectible(collectible.SubType)) {
      return;
    }

    pickup.Price = 15;
    pickup.ShopItemId = -1;
  }
}
