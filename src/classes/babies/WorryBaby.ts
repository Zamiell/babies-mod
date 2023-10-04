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
  postPickupCollect(pickup: EntityPickup, player: EntityPlayer): void {
    this.queueFutureTeleport(pickup, player);
  }

  @CallbackCustom(ModCallbackCustom.POST_PURCHASE)
  postPurchase(player: EntityPlayer, pickup: EntityPickup): void {
    this.queueFutureTeleport(pickup, player);
  }

  @CallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP)
  preItemPickup(player: EntityPlayer): void {
    this.queueFutureTeleport(undefined, player);
  }

  queueFutureTeleport(
    pickup: EntityPickup | undefined,
    player: EntityPlayer,
  ): void {
    if (pickup !== undefined && pickup.Touched) {
      return;
    }

    mod.runNextGameFrame(() => {
      useActiveItemTemp(player, CollectibleType.TELEPORT);
    });
  }
}
