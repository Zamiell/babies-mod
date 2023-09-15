import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** Touching items/pickups causes teleportation. */
export class WorryBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT)
  postPickupCollect(_pickup: EntityPickup, player: EntityPlayer): void {
    this.queueFutureTeleport(player);
  }

  @CallbackCustom(ModCallbackCustom.POST_PURCHASE)
  postPurchase(player: EntityPlayer): void {
    this.queueFutureTeleport(player);
  }

  @CallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP)
  preItemPickup(player: EntityPlayer): void {
    this.queueFutureTeleport(player);
  }

  queueFutureTeleport(player: EntityPlayer): void {
    mod.runNextGameFrame(() => {
      useActiveItemTemp(player, CollectibleType.TELEPORT);
    });
  }
}
