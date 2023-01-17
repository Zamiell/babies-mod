import {
  ActiveSlot,
  CollectibleType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  getCollectibleMaxCharges,
  playChargeSoundEffect,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../types/CollectibleTypeCustom";
import { Baby } from "../Baby";

/** Starts with Charging Station. */
export class PieceBBaby extends Baby {
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleTypeCustom.CHARGING_STATION)
  preUseItemChargingStation(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    const numCoins = player.GetNumCoins();

    if (numCoins === 0) {
      return undefined;
    }

    const hasBattery = player.HasCollectible(CollectibleType.BATTERY);

    for (const activeSlot of [ActiveSlot.SECONDARY, ActiveSlot.POCKET]) {
      const activeItem = player.GetActiveItem(activeSlot);
      if (activeItem === CollectibleType.NULL) {
        continue;
      }

      const currentCharges = player.GetActiveCharge(activeSlot);
      const currentBatteryCharges = player.GetBatteryCharge(activeSlot);
      const totalCharges = currentCharges + currentBatteryCharges;
      const maxCharges = getCollectibleMaxCharges(activeItem);
      if (hasBattery && totalCharges >= maxCharges * 2) {
        continue;
      }
      if (!hasBattery && totalCharges >= maxCharges) {
        continue;
      }

      player.AddCoins(-1);
      const incrementedCharge = currentCharges + 1;
      player.SetActiveCharge(incrementedCharge, activeSlot);
      playChargeSoundEffect(player, activeSlot);

      return true;
    }

    return undefined;
  }
}
