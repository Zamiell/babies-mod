import {
  CollectibleType,
  LevelStage,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  isQuestCollectible,
  onEffectiveStage,
} from "isaacscript-common";
import { mod } from "../../../mod";
import { isRerolledCollectibleBuggedHeart } from "../../../utils";
import { Baby } from "../../Baby";

/** Items cost money. */
export class FatesReward extends Baby {
  /**
   * - On stage 1, the player does not have 15 cents.
   * - On stage 2, they will miss a Devil Deal, which is not fair.
   * - On stage 6, they might not be able to buy the Polaroid (when playing on a normal run).
   * - On stage 10, there is no items.
   * - On stage 11, it would be unfair to deny the four items.
   */
  override isValid(player: EntityPlayer): boolean {
    const coins = player.GetNumCoins();

    return (
      coins >= 15 &&
      !onEffectiveStage(
        LevelStage.BASEMENT_1,
        LevelStage.BASEMENT_2,
        LevelStage.DEPTHS_2,
        LevelStage.SHEOL_CATHEDRAL,
        LevelStage.DARK_ROOM_CHEST,
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

    pickup.AutoUpdatePrice = false;
    pickup.Price = 15;
  }

  /**
   * Rerolled collectibles turn into hearts, so delete the heart and manually create another
   * pedestal item.
   */
  // 35
  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.HEART)
  postPickupUpdateHeart(pickup: EntityPickup): void {
    if (isRerolledCollectibleBuggedHeart(pickup)) {
      pickup.Remove();

      const collectible = mod.spawnCollectible(
        CollectibleType.NULL,
        pickup.Position,
        pickup.InitSeed,
      );
      collectible.AutoUpdatePrice = false;
      collectible.Price = 15;
    }
  }
}
