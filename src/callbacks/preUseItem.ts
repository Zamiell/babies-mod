import {
  ActiveSlot,
  CollectibleAnimation,
  CollectibleType,
  GridEntityType,
  ModCallback,
  PillColor,
  PillEffect,
  PlayerItemAnimation,
  PoopGridEntityVariant,
  SoundEffect,
} from "isaac-typescript-definitions";
import { game, sfxManager } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { mod } from "../mod";
import { getCurrentBaby } from "../utilsBaby";

export function init(): void {
  mod.AddCallback(
    ModCallback.PRE_USE_ITEM,
    poop,
    CollectibleType.POOP, // 36
  );

  mod.AddCallback(
    ModCallback.PRE_USE_ITEM,
    lemonMishap,
    CollectibleType.LEMON_MISHAP, // 56
  );

  mod.AddCallback(
    ModCallback.PRE_USE_ITEM,
    brownNugget,
    CollectibleType.BROWN_NUGGET, // 504
  );

  mod.AddCallback(
    ModCallback.PRE_USE_ITEM,
    sacrificialAltar,
    CollectibleType.SACRIFICIAL_ALTAR, // 536
  );
}

// CollectibleType.POOP (36)
function poop() {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return undefined;
  }

  // 262
  if (babyType !== RandomBabyType.PANDA) {
    return undefined;
  }

  // Spawn White Poop next to the player.
  Isaac.GridSpawn(
    GridEntityType.POOP,
    PoopGridEntityVariant.WHITE,
    g.p.Position,
  );

  sfxManager.Play(SoundEffect.FART);

  // Cancel the original effect.
  return true;
}

// CollectibleType.LEMON_MISHAP (56)
function lemonMishap() {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return undefined;
  }

  // 232
  if (babyType !== RandomBabyType.LEMON) {
    return undefined;
  }

  g.p.UsePill(PillEffect.LEMON_PARTY, PillColor.NULL);
  g.p.AnimateCollectible(
    CollectibleType.LEMON_MISHAP,
    PlayerItemAnimation.USE_ITEM,
    CollectibleAnimation.PLAYER_PICKUP,
  );

  // Cancel the original effect.
  return true;
}

// CollectibleType.BROWN_NUGGET (504)
function brownNugget() {
  const gameFrameCount = game.GetFrameCount();
  const [babyType, baby] = getCurrentBaby();
  if (babyType === -1) {
    return undefined;
  }

  // 303
  if (babyType !== RandomBabyType.PIZZA) {
    return undefined;
  }
  if (baby.delay === undefined) {
    error(`The "delay" attribute was not defined for: ${baby.name}`);
  }

  // Mark to spawn more of them on subsequent frames.
  if (g.run.babyCounters === 0) {
    g.run.babyCounters = 1;
    g.run.babyFrame = gameFrameCount + baby.delay;
  }

  return undefined;
}

// CollectibleType.SACRIFICIAL_ALTAR (536)
function sacrificialAltar(
  _collectibleType: number,
  _rng: RNG,
  player: EntityPlayer,
  _useFlags: int,
  _activeSlot: ActiveSlot,
) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return undefined;
  }

  // 202
  if (babyType !== RandomBabyType.BLINDFOLD) {
    return undefined;
  }

  // Prevent using Sacrificial Altar on this baby so that they don't delete the Incubus and become
  // softlocked.
  player.AnimateSad();
  return true;
}
