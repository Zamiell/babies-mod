import type { PickingUpItem } from "isaacscript-common";
import { CallbackCustom, ModCallbackCustom, game } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    paralyzedUntilGameFrame: null as int | null,
  },
};

/**
 * Touching items/pickups causes paralysis.
 *
 * We cannot use `player.UsePill(PillEffect.PARALYSIS, PillColor.NULL)` because it can cause crashes
 * for Japanese players.
 */
export class BluebirdBaby extends Baby {
  v = v;

  @CallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP)
  preItemPickup(player: EntityPlayer, _pickingUpItem: PickingUpItem): void {
    this.setParalysis(player);
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
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    v.run.paralyzedUntilGameFrame = gameFrameCount + num;
    player.AnimateSad();
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    const paralyzed =
      v.run.paralyzedUntilGameFrame !== null &&
      v.run.paralyzedUntilGameFrame > gameFrameCount;
    player.ControlsEnabled = !paralyzed;
  }
}
