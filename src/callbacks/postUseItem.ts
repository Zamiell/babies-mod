import {
  ActiveSlot,
  CollectibleType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  getCollectibleMaxCharges,
  playChargeSoundEffect,
} from "isaacscript-common";
import { mod } from "../mod";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    chargingStation,
    CollectibleTypeCustom.CHARGING_STATION,
  );
}

// CollectibleType.CHARGING_STATION
function chargingStation(
  _collectibleType: CollectibleType,
  _RNG: RNG,
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
