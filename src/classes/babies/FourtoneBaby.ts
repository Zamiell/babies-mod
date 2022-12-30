import {
  CollectibleType,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import { Callback, sfxManager } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with The Candle + blindfolded + instant recharge. */
export class FourtoneBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const activeItem = g.p.GetActiveItem();

    // Keep the Candle always fully charged.
    if (activeItem === CollectibleType.CANDLE && g.p.NeedsCharge()) {
      g.p.FullCharge();
      sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
    }
  }
}
