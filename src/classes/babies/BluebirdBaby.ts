import type { PickingUpItem } from "isaacscript-common";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

/**
 * Touching items/pickups causes paralysis.
 *
 * We cannot use `player.UsePill(PillEffect.PARALYSIS, PillColor.NULL)` because it can cause crashes
 * for Japanese players.
 */
export class BluebirdBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP)
  preItemPickup(
    player: EntityPlayer,
    _pickingUpItem: PickingUpItem,
  ): boolean | undefined {
    this.setParalysis(player);
    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT)
  postPickupCollect(_pickup: EntityPickup, player: EntityPlayer): void {
    this.setParalysis(player);
  }

  @CallbackCustom(ModCallbackCustom.POST_PURCHASE)
  postPurchase(player: EntityPlayer, _pickup: EntityPickup): void {
    this.setParalysis(player);
  }

  setParalysis(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    player.AnimateSad();
    player.AddControlsCooldown(num);
  }
}
