import {
  ActiveSlot,
  CollectibleType,
  SoundEffect,
} from "isaac-typescript-definitions";
import { sfxManager } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with The Battery. */
export class IsaacBaby extends Baby {
  /** We need to remove any additional charge that has accumulated. */
  override onRemove(): void {
    for (const slot of [ActiveSlot.PRIMARY, ActiveSlot.SECONDARY]) {
      if (
        g.p.GetActiveItem(slot) !== CollectibleType.NULL &&
        g.p.GetBatteryCharge(slot) > 0
      ) {
        g.p.DischargeActiveItem();
        g.p.FullCharge();
        sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
      }
    }
  }
}
