import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** Touching items/pickups causes teleportation. */
export class WorryBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT)
  postPickupCollect(): void {
    this.queueFutureTeleport();
  }

  @CallbackCustom(ModCallbackCustom.POST_PURCHASE)
  postPurchase(): void {
    this.queueFutureTeleport();
  }

  queueFutureTeleport(): void {
    mod.runInNGameFrames(() => {
      useActiveItemTemp(g.p, CollectibleType.TELEPORT);
    }, 1);
  }
}
