import { repeat } from "isaacscript-common";
import g from "../globals";
import { getCurrentBaby } from "../utils";

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

  mod.AddCallback(
    ModCallbacks.MC_PRE_USE_ITEM,
    sacrificialAltar,
    CollectibleType.COLLECTIBLE_SACRIFICIAL_ALTAR, // 536
  );
}

// CollectibleType.COLLECTIBLE_POOP (36)
function poop() {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  // 262
  if (baby.name !== "Panda Baby") {
    return undefined;
  }

  // Spawn White Poop next to the player
  Isaac.GridSpawn(
    GridEntityType.GRID_POOP,
    PoopGridEntityVariant.WHITE,
    g.p.Position,
    false,
  );

  g.sfx.Play(SoundEffect.SOUND_FART);

  // Cancel the original effect
  return true;
}

// CollectibleType.COLLECTIBLE_LEMON_MISHAP (56)
function lemonMishap() {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  // 232
  if (baby.name !== "Lemon Baby") {
    return undefined;
  }

  g.p.UsePill(PillEffect.PILLEFFECT_LEMON_PARTY, PillColor.PILL_NULL);
  g.p.AnimateCollectible(
    CollectibleType.COLLECTIBLE_LEMON_MISHAP,
    PlayerItemAnimation.USE_ITEM,
    CollectibleAnimation.PLAYER_PICKUP,
  );

  // Cancel the original effect
  return true;
}

// CollectibleType.COLLECTIBLE_ISAACS_TEARS (323)
function isaacsTears() {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  // 3
  if (baby.name !== "Water Baby") {
    return undefined;
  }

  const numIsaacTearsTears = 8;
  const baseVelocity = Vector(10, 0);

  repeat(numIsaacTearsTears, (i) => {
    const velocity = baseVelocity.Rotated(45 * (i + 1));
    const tear = g.p.FireTear(g.p.Position, velocity, false, false, false);

    // Increase the damage and make it look more impressive
    tear.CollisionDamage = g.p.Damage * 2;
    tear.Scale = 2;
    tear.KnockbackMultiplier = 20;
  });

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
function brownNugget() {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  // 303
  if (baby.name !== "Pizza Baby") {
    return undefined;
  }
  if (baby.delay === undefined) {
    error(`The "delay" attribute was not defined for: ${baby.name}`);
  }

  // Mark to spawn more of them on subsequent frames
  if (g.run.babyCounters === 0) {
    g.run.babyCounters = 1;
    g.run.babyFrame = gameFrameCount + baby.delay;
  }

  return undefined;
}

// CollectibleType.COLLECTIBLE_SACRIFICIAL_ALTAR (536)
function sacrificialAltar(
  _collectibleType: number,
  _rng: RNG,
  player: EntityPlayer,
  _useFlags: int,
  _activeSlot: ActiveSlot,
) {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  // 202
  if (baby.name !== "Blindfold Baby") {
    return undefined;
  }

  // Prevent using Sacrificial Altar on this baby so that they don't delete the Incubus and become
  // softlocked
  player.AnimateSad();
  return true;
}
