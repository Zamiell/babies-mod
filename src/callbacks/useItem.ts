import {
  getCollectibleMaxCharges,
  playChargeSoundEffect,
  removeCollectibleFromItemTracker,
  repeat,
} from "isaacscript-common";
import { NUM_SUCCUBI_IN_FLOCK } from "../constants";
import g from "../globals";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";
import { getCurrentBaby, spawnSlotHelper } from "../utils";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    shoopDaWhoop,
    CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP,
  ); // 49

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    monstrosTooth,
    CollectibleType.COLLECTIBLE_MONSTROS_TOOTH,
  ); // 86

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    howToJump,
    CollectibleType.COLLECTIBLE_HOW_TO_JUMP,
  ); // 282

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    clockworkAssembly,
    CollectibleTypeCustom.COLLECTIBLE_CLOCKWORK_ASSEMBLY,
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    flockOfSuccubi,
    CollectibleTypeCustom.COLLECTIBLE_FLOCK_OF_SUCCUBI,
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    chargingStation,
    CollectibleTypeCustom.COLLECTIBLE_CHARGING_STATION,
  );
}

// CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP (49)
function shoopDaWhoop(
  _collectibleType: CollectibleType,
  _RNG: RNG,
  player: EntityPlayer,
) {
  const gameFrameCount = g.g.GetFrameCount();
  const activeCharge = player.GetActiveCharge();
  const batteryCharge = player.GetBatteryCharge();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // 81
  if (baby.name === "Scream Baby") {
    g.run.babyFrame = gameFrameCount;
    g.run.babyCounters = activeCharge;
    g.run.babyNPC.type = batteryCharge;
  }
}

// CollectibleType.COLLECTIBLE_MONSTROS_TOOTH (86)
function monstrosTooth() {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // 221
  if (baby.name === "Drool Baby") {
    // Summon extra Monstro's, spaced apart
    g.run.babyCounters += 1;
    if (g.run.babyCounters === baby.num) {
      g.run.babyCounters = 0;
      g.run.babyFrame = 0;
    } else {
      g.run.babyFrame = gameFrameCount + 15;
    }
  }
}

// CollectibleType.COLLECTIBLE_HOW_TO_JUMP (282)
function howToJump() {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // 350
  if (baby.name === "Rabbit Baby") {
    if (baby.num === undefined) {
      error(`The "num" attribute was not defined for: ${baby.name}`);
    }
    g.run.babyFrame = gameFrameCount + baby.num;
  }
}

// CollectibleType.COLLECTIBLE_CLOCKWORK_ASSEMBLY
function clockworkAssembly(
  _collectibleType: CollectibleType,
  _RNG: RNG,
  player: EntityPlayer,
) {
  spawnSlotHelper(
    SlotVariant.SHOP_RESTOCK_MACHINE,
    player.Position,
    g.run.clockworkAssemblyRNG,
  );

  return true;
}

// CollectibleType.COLLECTIBLE_FLOCK_OF_SUCCUBI
function flockOfSuccubi(
  _collectibleType: CollectibleType,
  _RNG: RNG,
  player: EntityPlayer,
) {
  // Spawn N temporary Succubi
  repeat(NUM_SUCCUBI_IN_FLOCK, () => {
    player.AddCollectible(CollectibleType.COLLECTIBLE_SUCCUBUS, 0, false);
    removeCollectibleFromItemTracker(CollectibleType.COLLECTIBLE_SUCCUBUS);
  });

  // Mark to remove the items upon entering a new room
  g.run.flockOfSuccubi = true;

  return true;
}

// CollectibleType.COLLECTIBLE_CHARGING_STATION
function chargingStation(
  _collectibleType: CollectibleType,
  _RNG: RNG,
  player: EntityPlayer,
) {
  const numCoins = player.GetNumCoins();

  if (numCoins === 0) {
    return false;
  }

  const hasBattery = player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY);

  for (const activeSlot of [
    ActiveSlot.SLOT_SECONDARY,
    ActiveSlot.SLOT_POCKET,
  ]) {
    const activeItem = player.GetActiveItem(activeSlot);
    if (activeItem === CollectibleType.COLLECTIBLE_NULL) {
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

  return false;
}
