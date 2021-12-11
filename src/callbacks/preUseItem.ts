import g from "../globals";
import { getCurrentBaby } from "../util";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_PRE_USE_ITEM,
    poop,
    CollectibleType.COLLECTIBLE_POOP, // 36
  );

  mod.AddCallback(
    ModCallbacks.MC_PRE_USE_ITEM,
    lemonMishap,
    CollectibleType.COLLECTIBLE_LEMON_MISHAP, // 56
  );

  mod.AddCallback(
    ModCallbacks.MC_PRE_USE_ITEM,
    isaacsTears,
    CollectibleType.COLLECTIBLE_ISAACS_TEARS, // 323
  );

  mod.AddCallback(
    ModCallbacks.MC_PRE_USE_ITEM,
    brownNugget,
    CollectibleType.COLLECTIBLE_BROWN_NUGGET, // 504
  );
}

// CollectibleType.COLLECTIBLE_POOP (36)
function poop(_collectibleType: number, _rng: RNG) {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return false;
  }

  // 262
  if (baby.name !== "Panda Baby") {
    return false;
  }

  // Spawn White Poop next to the player
  Isaac.GridSpawn(
    GridEntityType.GRID_POOP,
    PoopGridEntityVariant.WHITE,
    g.p.Position,
    false,
  );

  g.sfx.Play(SoundEffect.SOUND_FART);

  return true; // Cancel the original effect
}

// CollectibleType.COLLECTIBLE_LEMON_MISHAP (56)
function lemonMishap(_collectibleType: number, _rng: RNG) {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return false;
  }

  // 232
  if (baby.name !== "Lemon Baby") {
    return false;
  }

  g.p.UsePill(PillEffect.PILLEFFECT_LEMON_PARTY, PillColor.PILL_NULL);
  g.p.AnimateCollectible(
    CollectibleType.COLLECTIBLE_LEMON_MISHAP,
    PlayerItemAnimation.USE_ITEM,
    CollectibleAnimation.PLAYER_PICKUP,
  );
  return true; // Cancel the original effect
}

// CollectibleType.COLLECTIBLE_ISAACS_TEARS (323)
function isaacsTears(_collectibleType: number, _rng: RNG) {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return false;
  }

  // 3
  if (baby.name !== "Water Baby") {
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
    PlayerItemAnimation.USE_ITEM,
    CollectibleAnimation.PLAYER_PICKUP,
  );

  // Cancel the original effect
  return true;
}

// CollectibleType.COLLECTIBLE_BROWN_NUGGET (504)
function brownNugget(_collectibleType: number, _rng: RNG) {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return false;
  }

  // 303
  if (baby.name !== "Pizza Baby") {
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
