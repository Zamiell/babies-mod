import {
  getCollectibleMaxCharges,
  playChargeSoundEffect,
} from "isaacscript-common";
import g from "../globals";
import { CollectibleTypeCustom } from "../types/enums";
import { getCurrentBaby } from "../util";

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

export function main(_collectibleType: CollectibleType, _RNG: RNG): boolean {
  const [, , valid] = getCurrentBaby();
  if (!valid) {
    return false;
  }

  // Certain items like The Nail mess up the player sprite (if they are standing still)
  // If we reload the sprite in this callback, it won't work,
  // so mark to update it in the PostUpdate callback
  g.run.reloadSprite = true;

  return false;
}

// CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP (49)
function shoopDaWhoop(_collectibleType: CollectibleType, _RNG: RNG) {
  const gameFrameCount = g.g.GetFrameCount();
  const activeCharge = g.p.GetActiveCharge();
  const batteryCharge = g.p.GetBatteryCharge();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return false;
  }

  if (baby.name === "Scream Baby") {
    // 81
    g.run.babyFrame = gameFrameCount;
    g.run.babyCounters = activeCharge;
    g.run.babyNPC.type = batteryCharge;
  }

  return false;
}

// CollectibleType.COLLECTIBLE_MONSTROS_TOOTH (86)
function monstrosTooth(_collectibleType: CollectibleType, _RNG: RNG) {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return false;
  }

  if (baby.name === "Drool Baby") {
    // 221
    // Summon extra Monstro's, spaced apart
    g.run.babyCounters += 1;
    if (g.run.babyCounters === baby.num) {
      g.run.babyCounters = 0;
      g.run.babyFrame = 0;
    } else {
      g.run.babyFrame = gameFrameCount + 15;
    }
  }

  return false;
}

// CollectibleType.COLLECTIBLE_HOW_TO_JUMP (282)
function howToJump(_collectibleType: CollectibleType, _RNG: RNG) {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return false;
  }

  if (baby.name === "Rabbit Baby") {
    // 350
    if (baby.num === undefined) {
      error(`The "num" attribute was not defined for ${baby.name}.`);
    }
    g.run.babyFrame = gameFrameCount + baby.num;
  }

  return false;
}

// CollectibleType.COLLECTIBLE_CLOCKWORK_ASSEMBLY
function clockworkAssembly(_collectibleType: CollectibleType, _RNG: RNG) {
  // Spawn a Restock Machine (6.10)
  g.run.clockworkAssembly = true;
  g.p.UseCard(Card.CARD_WHEEL_OF_FORTUNE);
  g.p.AnimateCollectible(
    CollectibleTypeCustom.COLLECTIBLE_CLOCKWORK_ASSEMBLY,
    PlayerItemAnimation.USE_ITEM,
    CollectibleAnimation.PLAYER_PICKUP,
  );

  return false;
}

// CollectibleType.COLLECTIBLE_FLOCK_OF_SUCCUBI
function flockOfSuccubi(_collectibleType: CollectibleType, _RNG: RNG) {
  // Spawn 10 temporary Succubi
  // (for some reason, adding 7 actually adds 28)
  for (let i = 0; i < 7; i++) {
    g.p.AddCollectible(CollectibleType.COLLECTIBLE_SUCCUBUS, 0, false);
  }
  g.p.AnimateCollectible(
    CollectibleTypeCustom.COLLECTIBLE_FLOCK_OF_SUCCUBI,
    PlayerItemAnimation.USE_ITEM,
    CollectibleAnimation.PLAYER_PICKUP,
  );

  // Mark to remove the items upon entering a new room
  g.run.flockOfSuccubi = true;

  return false;
}

// CollectibleType.COLLECTIBLE_CHARGING_STATION
function chargingStation(_collectibleType: CollectibleType, _RNG: RNG) {
  const numCoins = g.p.GetNumCoins();
  const schoolbagItem = g.p.GetActiveItem(ActiveSlot.SLOT_SECONDARY);

  if (
    numCoins === 0 ||
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG) ||
    schoolbagItem === 0
  ) {
    return false;
  }

  const currentCharges = g.p.GetActiveCharge(ActiveSlot.SLOT_SECONDARY);
  const currentBatteryCharges = g.p.GetBatteryCharge(ActiveSlot.SLOT_SECONDARY);
  const totalCharges = currentCharges + currentBatteryCharges;
  const maxCharges = getCollectibleMaxCharges(schoolbagItem);
  const hasBattery = g.p.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY);
  if (hasBattery && totalCharges >= maxCharges * 2) {
    return false;
  }
  if (!hasBattery && totalCharges >= maxCharges) {
    return false;
  }

  g.p.AddCoins(-1);
  const incrementedCharge = currentCharges + 1;
  g.p.SetActiveCharge(incrementedCharge, ActiveSlot.SLOT_SECONDARY);
  g.p.AnimateCollectible(
    CollectibleTypeCustom.COLLECTIBLE_CHARGING_STATION,
    PlayerItemAnimation.USE_ITEM,
    CollectibleAnimation.PLAYER_PICKUP,
  );
  playChargeSoundEffect(g.p, ActiveSlot.SLOT_SECONDARY);

  return false;
}
