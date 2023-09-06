import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  repeat,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    pickupsTaken: 0,
  },
};

/** -1 damage per pickup taken. */
export class CuteBaby extends Baby {
  v = v;

  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.DAMAGE)
  evaluateCacheDamage(player: EntityPlayer): void {
    repeat(v.run.pickupsTaken, () => {
      player.Damage--;
    });
  }

  @CallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT)
  postPickupCollect(_pickup: EntityPickup, player: EntityPlayer): void {
    decrementDamage(player);
  }

  @CallbackCustom(ModCallbackCustom.POST_PURCHASE)
  postPurchase(player: EntityPlayer): void {
    decrementDamage(player);
  }
}

function decrementDamage(player: EntityPlayer) {
  v.run.pickupsTaken++;
  player.AddCacheFlags(CacheFlag.DAMAGE);
  player.EvaluateItems();
}
