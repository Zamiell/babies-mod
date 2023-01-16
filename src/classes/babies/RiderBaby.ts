import { CollectibleType, SoundEffect } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  sfxManager,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with A Pony + blindfolded. */
export class RiderBaby extends Baby {
  /** Keep the pony fully charged. */
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const activeItem = player.GetActiveItem();

    if (activeItem === CollectibleType.PONY && player.NeedsCharge()) {
      player.FullCharge();
      sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
    }
  }
}
