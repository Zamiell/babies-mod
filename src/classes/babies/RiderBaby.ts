import {
  CollectibleType,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import { Callback, sfxManager } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with A Pony (improved) + blindfolded. */
export class RiderBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const activeItem = g.p.GetActiveItem();

    // Keep the pony fully charged.
    if (activeItem === CollectibleType.PONY && g.p.NeedsCharge()) {
      g.p.FullCharge();
      sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
    }
  }
}
