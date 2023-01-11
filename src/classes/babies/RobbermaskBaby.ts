import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  repeat,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** +1 damage per pickup taken. */
export class RobbermaskBaby extends Baby {
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.DAMAGE)
  evaluateCacheDamage(player: EntityPlayer): void {
    repeat(g.run.babyCounters, () => {
      player.Damage++;
    });
  }

  @CallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT)
  postPickupCollect(_pickup: EntityPickup, player: EntityPlayer): void {
    incrementDamage(player);
  }

  @CallbackCustom(ModCallbackCustom.POST_PURCHASE)
  postPurchase(player: EntityPlayer): void {
    incrementDamage(player);
  }
}

function incrementDamage(player: EntityPlayer) {
  g.run.babyCounters++;
  player.AddCacheFlags(CacheFlag.DAMAGE);
  player.EvaluateItems();
}
