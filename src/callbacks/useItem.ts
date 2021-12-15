import {
  getCollectibleMaxCharges,
  nextSeed,
  playChargeSoundEffect,
  removeCollectibleFromItemTracker,
} from "isaacscript-common";
import { NUM_SUCCUBI_IN_FLOCK } from "../constants";
import g from "../globals";
import { CollectibleTypeCustom } from "../types/enums";
import { getCurrentBaby, spawnSlot } from "../util";

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
      error(`The "num" attribute was not defined for ${baby.name}.`);
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
  g.run.clockworkAssemblySeed = nextSeed(g.run.clockworkAssemblySeed);
  spawnSlot(
    SlotVariant.SHOP_RESTOCK_MACHINE,
    player.Position,
    g.run.clockworkAssemblySeed,
  );

  player.AnimateCollectible(
    CollectibleTypeCustom.COLLECTIBLE_CLOCKWORK_ASSEMBLY,
    PlayerItemAnimation.USE_ITEM,
    CollectibleAnimation.PLAYER_PICKUP,
  );
}

// CollectibleType.COLLECTIBLE_FLOCK_OF_SUCCUBI
function flockOfSuccubi(
  _collectibleType: CollectibleType,
  _RNG: RNG,
  player: EntityPlayer,
) {
  // Spawn N temporary Succubi
  for (let i = 0; i < NUM_SUCCUBI_IN_FLOCK; i++) {
    player.AddCollectible(CollectibleType.COLLECTIBLE_SUCCUBUS, 0, false);
    removeCollectibleFromItemTracker(CollectibleType.COLLECTIBLE_SUCCUBUS);
  }
  player.AnimateCollectible(
    CollectibleTypeCustom.COLLECTIBLE_FLOCK_OF_SUCCUBI,
    PlayerItemAnimation.USE_ITEM,
    CollectibleAnimation.PLAYER_PICKUP,
  );

  // Mark to remove the items upon entering a new room
  g.run.flockOfSuccubi = true;
}

// CollectibleType.COLLECTIBLE_CHARGING_STATION
function chargingStation(
  _collectibleType: CollectibleType,
  _RNG: RNG,
  player: EntityPlayer,
) {
  const numCoins = player.GetNumCoins();
  const schoolbagItem = player.GetActiveItem(ActiveSlot.SLOT_SECONDARY);

  if (
    numCoins === 0 ||
    !player.HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG) ||
    schoolbagItem === 0
  ) {
    return false;
  }

  const currentCharges = player.GetActiveCharge(ActiveSlot.SLOT_SECONDARY);
  const currentBatteryCharges = player.GetBatteryCharge(
    ActiveSlot.SLOT_SECONDARY,
  );
  const totalCharges = currentCharges + currentBatteryCharges;
  const maxCharges = getCollectibleMaxCharges(schoolbagItem);
  const hasBattery = player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY);
  if (hasBattery && totalCharges >= maxCharges * 2) {
    return false;
  }
  if (!hasBattery && totalCharges >= maxCharges) {
    return false;
  }

  player.AddCoins(-1);
  const incrementedCharge = currentCharges + 1;
  player.SetActiveCharge(incrementedCharge, ActiveSlot.SLOT_SECONDARY);
  player.AnimateCollectible(
    CollectibleTypeCustom.COLLECTIBLE_CHARGING_STATION,
    PlayerItemAnimation.USE_ITEM,
    CollectibleAnimation.PLAYER_PICKUP,
  );
  playChargeSoundEffect(player, ActiveSlot.SLOT_SECONDARY);

  return false;
}
