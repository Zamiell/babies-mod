import {
  ButtonAction,
  CollectibleType,
  DarkEsauVariant,
  EntityType,
  LevelCurse,
} from "isaac-typescript-definitions";
import {
  game,
  MAX_NUM_FAMILIARS,
  removeCollectibleFromItemTracker,
  repeat,
  spawn,
} from "isaacscript-common";
import { RandomBabyType } from "./enums/RandomBabyType";
import { g } from "./globals";
import { initSprite } from "./sprite";
import { getCurrentBabyDescription } from "./utilsBaby";

export const babyAddFunctionMap = new Map<RandomBabyType, () => void>();

// 39
babyAddFunctionMap.set(RandomBabyType.NOOSE, () => {
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  // Don't shoot when the timer reaches 0. Set the timer so that we don't take damage immediately
  // upon reaching the floor.
  g.run.babyCounters = game.GetFrameCount() + baby.num;
});

// 40
babyAddFunctionMap.set(RandomBabyType.HIVE, () => {
  // The game caps the current number of familiars.
  const halfMaxFamiliars = MAX_NUM_FAMILIARS / 2;
  g.p.AddBlueFlies(halfMaxFamiliars, g.p.Position, undefined);
  repeat(halfMaxFamiliars, () => {
    g.p.AddBlueSpider(g.p.Position);
  });
});

// 43
babyAddFunctionMap.set(RandomBabyType.WHORE, () => {
  g.run.babyExplosions = [];
});

// 48
babyAddFunctionMap.set(RandomBabyType.DARK, () => {
  // Temporary blindness
  g.run.babySprite = initSprite("gfx/misc/black.anm2");
});

// 107
babyAddFunctionMap.set(RandomBabyType.BROWNIE, () => {
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error('Brownie Baby does not have a "num" property defined.');
  }

  for (const collectibleType of [
    CollectibleType.CUBE_OF_MEAT,
    CollectibleType.BALL_OF_BANDAGES,
  ]) {
    repeat(baby.num, () => {
      g.p.AddCollectible(collectibleType);
      removeCollectibleFromItemTracker(collectibleType);
    });
  }
});

// 125
babyAddFunctionMap.set(RandomBabyType.HOPELESS, () => {
  // Keys are hearts
  g.p.AddKeys(2);

  g.run.babySprite = initSprite("gfx/custom-health/key.anm2");
});

// 138
babyAddFunctionMap.set(RandomBabyType.MOHAWK, () => {
  // Bombs are hearts
  g.p.AddBombs(2);

  g.run.babySprite = initSprite("gfx/custom-health/bomb.anm2");
});

// 177
babyAddFunctionMap.set(RandomBabyType.ABAN, () => {
  // Coins are hearts
  g.p.AddCoins(2);
});

// 281
babyAddFunctionMap.set(RandomBabyType.FANG_DEMON, () => {
  // These items will cause a softlock, so just remove them from all pools as a quick fix.
  g.itemPool.RemoveCollectible(CollectibleType.MOMS_KNIFE); // 114
  g.itemPool.RemoveCollectible(CollectibleType.EPIC_FETUS); // 168
  g.itemPool.RemoveCollectible(CollectibleType.MONSTROS_LUNG); // 229
  g.itemPool.RemoveCollectible(CollectibleType.TECH_X); // 395
});

// 341
babyAddFunctionMap.set(RandomBabyType.VOMIT, () => {
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  g.run.babyCounters = game.GetFrameCount() + baby.num;
});

// 343
babyAddFunctionMap.set(RandomBabyType.CYBORG, () => {
  Isaac.ExecuteCommand("debug 7");
});

// 350
babyAddFunctionMap.set(RandomBabyType.RABBIT, () => {
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  g.run.babyFrame = game.GetFrameCount() + baby.num;
});

// 386
babyAddFunctionMap.set(RandomBabyType.IMP, () => {
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  // Start the direction at left.
  g.run.babyCounters = ButtonAction.SHOOT_LEFT;
  g.run.babyFrame = game.GetFrameCount() + baby.num;
});

// 424
babyAddFunctionMap.set(RandomBabyType.RICH, () => {
  g.p.AddCoins(99);
});

// 511
babyAddFunctionMap.set(RandomBabyType.TWITCHY, () => {
  const baby = getCurrentBabyDescription();
  if (baby.max === undefined) {
    error(`The "max" attribute was not defined for: ${baby.name}`);
  }

  // Start with the slowest tears and mark to update them on this frame.
  g.run.babyCounters = baby.max;
  g.run.babyFrame = game.GetFrameCount();
});

// 521
babyAddFunctionMap.set(RandomBabyType.FOUND_SOUL, () => {
  const numDarkEsaus = Isaac.CountEntities(undefined, EntityType.DARK_ESAU);
  if (numDarkEsaus > 0) {
    return;
  }

  const bottomLeftGridIndex = 92;
  const bottomLeftPosition = g.r.GetGridPosition(bottomLeftGridIndex);
  spawn(EntityType.DARK_ESAU, DarkEsauVariant.DARK_ESAU, 0, bottomLeftPosition);
});

// 550
babyAddFunctionMap.set(RandomBabyType.BULLET, () => {
  const numBombs = g.p.GetNumBombs();

  g.run.babyCounters = numBombs;
  g.p.AddBombs(99);
});

// 556
babyAddFunctionMap.set(RandomBabyType.CURSED_ROOM, () => {
  g.l.AddCurse(LevelCurse.CURSED, false);
});
