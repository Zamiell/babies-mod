import { CollectibleType, SoundEffect } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  sfxManager,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with The Candle + blindfolded + instant recharge. */
export class FourtoneBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const activeItem = player.GetActiveItem();

    // Keep the Candle always fully charged.
    if (activeItem === CollectibleType.CANDLE && player.NeedsCharge()) {
      player.FullCharge();
      sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
    }
  }
}
