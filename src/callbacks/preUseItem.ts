import g from "../globals";
import * as misc from "../misc";

// CollectibleType.COLLECTIBLE_POOP (36)
export function poop(_collectibleType: number, _rng: RNG): boolean {
  // Local variables
  const [, baby, valid] = misc.getCurrentBaby();
  if (!valid) {
    return false;
  }

  if (
    baby.name !== "Panda Baby" // 262
  ) {
    return false;
  }

  // Spawn White Poop next to the player
  Isaac.GridSpawn(
    GridEntityType.GRID_POOP,
    PoopVariant.POOP_WHITE,
    g.p.Position,
    false,
  );

  // Playing "SoundEffect.SOUND_FART" will randomly play one of the three farting sound effects
  g.sfx.Play(SoundEffect.SOUND_FART, 1, 0, false, 1);

  return true; // Cancel the original effect
}

// CollectibleType.COLLECTIBLE_LEMON_MISHAP (56)
export function lemonMishap(_collectibleType: number, _rng: RNG): boolean {
  // Local variables
  const [, baby, valid] = misc.getCurrentBaby();
  if (!valid) {
    return false;
  }

  if (
    baby.name !== "Lemon Baby" // 232
  ) {
    return false;
  }

  g.p.UsePill(PillEffect.PILLEFFECT_LEMON_PARTY, PillColor.PILL_NULL);
  g.p.AnimateCollectible(
    CollectibleType.COLLECTIBLE_LEMON_MISHAP,
    "UseItem",
    "PlayerPickup",
  );
  return true; // Cancel the original effect
}

// CollectibleType.COLLECTIBLE_ISAACS_TEARS (323)
export function isaacsTears(_collectibleType: number, _rng: RNG): boolean {
  // Local variables
  const [, baby, valid] = misc.getCurrentBaby();
  if (!valid) {
    return false;
  }

  if (
    baby.name !== "Water Baby" // 3
  ) {
    return false;
  }

  let velocity = Vector(10, 0);
  for (let i = 0; i < 8; i++) {
    velocity = velocity.Rotated(45);
    const tear = g.p.FireTear(g.p.Position, velocity, false, false, false);

    // Increase the damage and make it look more impressive
    tear.CollisionDamage = g.p.Damage * 2;
    tear.Scale = 2;
    tear.KnockbackMultiplier = 20;
  }

  // When we return from the function below, no animation will play,
  // so we have to explicitly perform one
  g.p.AnimateCollectible(
    CollectibleType.COLLECTIBLE_ISAACS_TEARS,
    "UseItem",
    "PlayerPickup",
  );

  // Cancel the original effect
  return true;
}

// CollectibleType.COLLECTIBLE_SMELTER (479)
// This callback is used naturally by Gulp! pills
export function smelter(_collectibleType: number, _rng: RNG): boolean {
  // Local variables
  const [, baby, valid] = misc.getCurrentBaby();
  if (!valid) {
    return false;
  }

  if (baby.trinket === undefined) {
    return false;
  }

  // We want to keep track if the player smelts the trinket so that we don't give another copy back
  // to them
  const trinket1 = g.p.GetTrinket(0); // This will be 0 if there is no trinket
  const trinket2 = g.p.GetTrinket(1); // This will be 0 if there is no trinket
  if (trinket1 === baby.trinket || trinket2 === baby.trinket) {
    g.run.level.trinketGone = true;
  }

  // Go on to do the Smelter effect
  return false;
}

// CollectibleType.COLLECTIBLE_BROWN_NUGGET (504)
export function brownNugget(_collectibleType: number, _rng: RNG): boolean {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby, valid] = misc.getCurrentBaby();
  if (!valid) {
    return false;
  }

  if (
    baby.name !== "Pizza Baby" // 303
  ) {
    return false;
  }
  if (baby.delay === undefined) {
    error(`The "delay" attribute was not defined for ${baby.name}.`);
  }

  // Mark to spawn more of them on subsequent frames
  if (g.run.babyCounters === 0) {
    g.run.babyCounters = 1;
    g.run.babyFrame = gameFrameCount + baby.delay;
  }

  return false;
}
