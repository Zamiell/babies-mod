import {
  ActiveSlot,
  CollectibleType,
  SoundEffect,
} from "isaac-typescript-definitions";
import { sfxManager } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with The Battery. */
export class IsaacBaby extends Baby {
  /** We need to remove any additional charge that has accumulated. */
  override onRemove(player: EntityPlayer): void {
    for (const slot of [ActiveSlot.PRIMARY, ActiveSlot.SECONDARY]) {
      if (
        player.GetActiveItem(slot) !== CollectibleType.NULL &&
        player.GetBatteryCharge(slot) > 0
      ) {
        player.DischargeActiveItem();
        player.FullCharge();
        sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
      }
    }
  }
}
