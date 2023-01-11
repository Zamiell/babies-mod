import {
  ActiveSlot,
  CollectibleType,
  ModCallback,
  SlotVariant,
} from "isaac-typescript-definitions";
import {
  getCollectibleMaxCharges,
  playChargeSoundEffect,
  removeCollectibleFromItemTracker,
  repeat,
} from "isaacscript-common";
import { NUM_SUCCUBI_IN_FLOCK } from "../constants";
import { g } from "../globals";
import { mod } from "../mod";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";
import { spawnSlotHelper } from "../utils";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    clockworkAssembly,
    CollectibleTypeCustom.CLOCKWORK_ASSEMBLY,
  );

  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    flockOfSuccubi,
    CollectibleTypeCustom.FLOCK_OF_SUCCUBI,
  );

  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    chargingStation,
    CollectibleTypeCustom.CHARGING_STATION,
  );
}

// CollectibleType.CLOCKWORK_ASSEMBLY
function clockworkAssembly(
  _collectibleType: CollectibleType,
  _RNG: RNG,
  player: EntityPlayer,
): boolean | undefined {
  spawnSlotHelper(
    SlotVariant.SHOP_RESTOCK_MACHINE,
    player.Position,
    g.run.clockworkAssemblyRNG,
  );

  return true;
}

// CollectibleType.FLOCK_OF_SUCCUBI
function flockOfSuccubi(
  _collectibleType: CollectibleType,
  _RNG: RNG,
  player: EntityPlayer,
): boolean | undefined {
  // Spawn N temporary Succubi.
  repeat(NUM_SUCCUBI_IN_FLOCK, () => {
    player.AddCollectible(CollectibleType.SUCCUBUS, 0, false);
    removeCollectibleFromItemTracker(CollectibleType.SUCCUBUS);
  });

  // Mark to remove the items upon entering a new room.
  g.run.flockOfSuccubi = true;

  return true;
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
