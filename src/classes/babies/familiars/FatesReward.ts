import {
  CollectibleType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import { Callback, getEffectiveStage } from "isaacscript-common";
import { g } from "../../../globals";
import { mod } from "../../../mod";
import { isRerolledCollectibleBuggedHeart } from "../../../utils";
import { Baby } from "../../Baby";

/** Items cost money. */
export class FatesReward extends Baby {
  /**
   * On stage 1, the player does not have 15 cents. On stage 2, they will miss a Devil Deal, which
   * is not fair. On stage 6, they might not be able to buy the Polaroid (when playing on a normal
   * run). On stage 10 and 11, there are no items.
   */
  override isValid(player: EntityPlayer): boolean {
    const coins = player.GetNumCoins();
    const effectiveStage = getEffectiveStage();

    return (
      coins >= 15 &&
      effectiveStage >= 3 &&
      effectiveStage !== 6 &&
      effectiveStage <= 9
    );
  }

  // 34
  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.COLLECTIBLE)
  postPickupInitCollectible(pickup: EntityPickup): void {
    pickup.AutoUpdatePrice = false;
    pickup.Price = 15;
  }

  // 35
  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.HEART)
  postPickupUpdateHeart(pickup: EntityPickup): void {
    // Rerolled items turn into hearts, so delete the heart and manually create another pedestal
    // item.
    if (isRerolledCollectibleBuggedHeart(pickup)) {
      pickup.Remove();

      const collectible = mod.spawnCollectible(
        CollectibleType.NULL,
        pickup.Position,
        g.run.room.rng,
      );
      collectible.AutoUpdatePrice = false;
      collectible.Price = 15;
    }
  }
}
