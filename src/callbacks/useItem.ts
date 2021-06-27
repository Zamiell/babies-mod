import g from "../globals";
import { getCurrentBaby, getItemMaxCharges } from "../misc";
import { CollectibleTypeCustom } from "../types/enums";

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
export function shoopDaWhoop(
  _collectibleType: CollectibleType,
  _RNG: RNG,
): boolean {
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
export function monstrosTooth(
  _collectibleType: CollectibleType,
  _RNG: RNG,
): boolean {
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
export function howToJump(
  _collectibleType: CollectibleType,
  _RNG: RNG,
): boolean {
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
export function clockworkAssembly(
  _collectibleType: CollectibleType,
  _RNG: RNG,
): boolean {
  // Spawn a Restock Machine (6.10)
  g.run.clockworkAssembly = true;
  g.p.UseCard(Card.CARD_WHEEL_OF_FORTUNE);
  g.p.AnimateCollectible(
    CollectibleTypeCustom.COLLECTIBLE_CLOCKWORK_ASSEMBLY,
    "UseItem",
    "PlayerPickup",
  );

  return false;
}

// CollectibleType.COLLECTIBLE_FLOCK_OF_SUCCUBI
export function flockOfSuccubi(
  _collectibleType: CollectibleType,
  _RNG: RNG,
): boolean {
  const effects = g.p.GetEffects();

  // Spawn 10 temporary Succubi
  // (for some reason, adding 7 actually adds 28)
  for (let i = 0; i < 7; i++) {
    effects.AddCollectibleEffect(CollectibleType.COLLECTIBLE_SUCCUBUS, false);
  }
  g.p.AnimateCollectible(
    CollectibleTypeCustom.COLLECTIBLE_FLOCK_OF_SUCCUBI,
    "UseItem",
    "PlayerPickup",
  );

  return false;
}

// CollectibleType.COLLECTIBLE_CHARGING_STATION
export function chargingStation(
  _collectibleType: CollectibleType,
  _RNG: RNG,
): boolean {
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
  const maxCharges = getItemMaxCharges(schoolbagItem);
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
    "UseItem",
    "PlayerPickup",
  );
  g.sfx.Play(SoundEffect.SOUND_BEEP, 1, 0);

  return false;
}
