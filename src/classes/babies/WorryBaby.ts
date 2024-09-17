import { BombVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  spawnBomb,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Touching items/pickups spawns Mega Troll Bombs. */
export class WorryBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT)
  postPickupCollect(pickup: EntityPickup, _player: EntityPlayer): void {
    spawnMegaTrollBomb(pickup.Position);
  }

  @CallbackCustom(ModCallbackCustom.POST_PURCHASE)
  postPurchase(_player: EntityPlayer, pickup: EntityPickup): void {
    spawnMegaTrollBomb(pickup.Position);
  }

  @CallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP)
  preItemPickup(player: EntityPlayer): boolean | undefined {
    spawnMegaTrollBomb(player.Position);
    return undefined;
  }
}

function spawnMegaTrollBomb(position: Vector) {
  spawnBomb(BombVariant.MEGA_TROLL, 0, position);
}
