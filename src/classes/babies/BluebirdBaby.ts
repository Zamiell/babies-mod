import { PillColor, PillEffect } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Touching items/pickups causes paralysis. */
export class BluebirdBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP)
  preItemPickup(player: EntityPlayer): void {
    useParalysisPill(player);
  }

  @CallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT)
  postPickupCollect(_pickup: EntityPickup, player: EntityPlayer): void {
    useParalysisPill(player);
  }
}

function useParalysisPill(player: EntityPlayer) {
  player.UsePill(PillEffect.PARALYSIS, PillColor.NULL);
}
