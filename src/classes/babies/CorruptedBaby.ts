import { DamageFlagZero } from "isaac-typescript-definitions";
import type { PickingUpItem } from "isaacscript-common";
import {
  CallbackCustom,
  isPickingUpItemCollectible,
  isQuestCollectible,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Touching items/pickups causes damage. */
export class CorruptedBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT)
  postPickupCollect(_pickup: EntityPickup, player: EntityPlayer): void {
    playerDealSelfDamage(player);
  }

  @CallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP)
  preItemPickup(player: EntityPlayer, pickingUpItem: PickingUpItem): void {
    if (
      isPickingUpItemCollectible(pickingUpItem) &&
      !isQuestCollectible(pickingUpItem.subType)
    ) {
      playerDealSelfDamage(player);
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_PURCHASE)
  postPurchase(player: EntityPlayer): void {
    playerDealSelfDamage(player);
  }
}

function playerDealSelfDamage(player: EntityPlayer) {
  player.TakeDamage(1, DamageFlagZero, EntityRef(player), 0);
}
