import {
  ActiveSlot,
  CollectibleType,
  EntityType,
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
import g from "../globals";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";
import { getCurrentBaby, spawnSlotHelper } from "../utils";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    shoopDaWhoop,
    CollectibleType.SHOOP_DA_WHOOP,
  ); // 49

  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    monstrosTooth,
    CollectibleType.MONSTROS_TOOTH,
  ); // 86

  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    howToJump,
    CollectibleType.HOW_TO_JUMP,
  ); // 282

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

// CollectibleType.SHOOP_DA_WHOOP (49)
function shoopDaWhoop(
  _collectibleType: CollectibleType,
  _RNG: RNG,
  player: EntityPlayer,
): boolean | undefined {
  const gameFrameCount = g.g.GetFrameCount();
  const activeCharge = player.GetActiveCharge();
  const batteryCharge = player.GetBatteryCharge();
  const [babyType, baby] = getCurrentBaby();
  if (babyType === -1) {
    return undefined;
  }

  // 81
  if (baby.name === "Scream Baby") {
    g.run.babyFrame = gameFrameCount;
    g.run.babyCounters = activeCharge;
    g.run.babyNPC.entityType = batteryCharge as EntityType;
  }
}

// CollectibleType.MONSTROS_TOOTH (86)
function monstrosTooth(
  _collectibleType: CollectibleType,
  _RNG: RNG,
  _player: EntityPlayer,
): boolean | undefined {
  const gameFrameCount = g.g.GetFrameCount();
  const [babyType, baby] = getCurrentBaby();
  if (babyType === -1) {
    return undefined;
  }

  // 221
  if (baby.name === "Drool Baby") {
    // Summon extra Monstro's, spaced apart.
    g.run.babyCounters += 1;
    if (g.run.babyCounters === baby.num) {
      g.run.babyCounters = 0;
      g.run.babyFrame = 0;
    } else {
      g.run.babyFrame = gameFrameCount + 15;
    }
  }
}

// CollectibleType.HOW_TO_JUMP (282)
function howToJump(
  _collectibleType: CollectibleType,
  _RNG: RNG,
  _player: EntityPlayer,
): boolean | undefined {
  const gameFrameCount = g.g.GetFrameCount();
  const [babyType, baby] = getCurrentBaby();
  if (babyType === -1) {
    return undefined;
  }

  // 350
  if (baby.name === "Rabbit Baby") {
    if (baby.num === undefined) {
      error(`The "num" attribute was not defined for: ${baby.name}`);
    }
    g.run.babyFrame = gameFrameCount + baby.num;
  }
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
    return false;
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

  return false;
}
