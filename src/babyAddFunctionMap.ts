import {
  ButtonAction,
  CollectibleType,
  DarkEsauVariant,
  EntityType,
  LevelCurse,
} from "isaac-typescript-definitions";
import {
  MAX_NUM_FAMILIARS,
  removeCollectibleFromItemTracker,
  repeat,
  spawn,
} from "isaacscript-common";
import { RandomBabyType } from "./babies";
import g from "./globals";
import { initSprite } from "./sprite";
import { getCurrentBabyDescription } from "./utils";

export const babyAddFunctionMap = new Map<int, () => void>();

// Gold Baby
babyAddFunctionMap.set(15, () => {
  g.p.AddGoldenBomb();
  g.p.AddGoldenKey();
  g.p.AddGoldenHearts(12);
});

// Rage Baby
babyAddFunctionMap.set(31, () => {
  const numBombs = g.p.GetNumBombs();

  g.run.babyCounters = numBombs;
  g.p.AddBombs(99);
});

// Noose Baby
babyAddFunctionMap.set(39, () => {
  const baby = getCurrentBabyDescription();
  if (baby.time === undefined) {
    error(`The "time" attribute was not defined for: ${baby.name}`);
  }

  // Don't shoot when the timer reaches 0. Set the timer so that we don't take damage immediately
  // upon reaching the floor.
  g.run.babyCounters = g.g.GetFrameCount() + baby.time;
});

// Hive Baby
babyAddFunctionMap.set(40, () => {
  // The game caps the current number of familiars.
  const halfMaxFamiliars = MAX_NUM_FAMILIARS / 2;
  g.p.AddBlueFlies(halfMaxFamiliars, g.p.Position, undefined);
  repeat(halfMaxFamiliars, () => {
    g.p.AddBlueSpider(g.p.Position);
  });
});

// Whore Baby
babyAddFunctionMap.set(43, () => {
  g.run.babyExplosions = [];
});

// Dark Baby
babyAddFunctionMap.set(48, () => {
  // Temporary blindness
  g.run.babySprite = initSprite("gfx/misc/black.anm2");
});

// Brownie Baby
babyAddFunctionMap.set(107, () => {
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

// Hopeless Baby
babyAddFunctionMap.set(125, () => {
  // Keys are hearts
  g.p.AddKeys(2);

  g.run.babySprite = initSprite("gfx/custom-health/key.anm2");
});

// Mohawk Baby
babyAddFunctionMap.set(138, () => {
  // Bombs are hearts
  g.p.AddBombs(2);

  g.run.babySprite = initSprite("gfx/custom-health/bomb.anm2");
});

// Aban Baby
babyAddFunctionMap.set(177, () => {
  // Coins are hearts
  g.p.AddCoins(2);
});

// Fang Demon Baby
babyAddFunctionMap.set(281, () => {
  // These items will cause a softlock, so just remove them from all pools as a quick fix.
  g.itemPool.RemoveCollectible(CollectibleType.MOMS_KNIFE); // 114
  g.itemPool.RemoveCollectible(CollectibleType.EPIC_FETUS); // 168
  g.itemPool.RemoveCollectible(CollectibleType.MONSTROS_LUNG); // 229
  g.itemPool.RemoveCollectible(CollectibleType.TECH_X); // 395
});

// Vomit Baby
babyAddFunctionMap.set(341, () => {
  const baby = getCurrentBabyDescription();
  if (baby.time === undefined) {
    error(`The "time" attribute was not defined for: ${baby.name}`);
  }

  g.run.babyCounters = g.g.GetFrameCount() + baby.time;
});

// Cyborg Baby
babyAddFunctionMap.set(343, () => {
  Isaac.ExecuteCommand("debug 7");
});

// Rabbit Baby
babyAddFunctionMap.set(350, () => {
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  g.run.babyFrame = g.g.GetFrameCount() + baby.num;
});

// Imp Baby
babyAddFunctionMap.set(386, () => {
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  // Start the direction at left.
  g.run.babyCounters = ButtonAction.SHOOT_LEFT;
  g.run.babyFrame = g.g.GetFrameCount() + baby.num;
});

// Rich Baby
babyAddFunctionMap.set(424, () => {
  g.p.AddCoins(99);
});

// Twitchy Baby
babyAddFunctionMap.set(511, () => {
  const baby = getCurrentBabyDescription();
  if (baby.max === undefined) {
    error(`The "max" attribute was not defined for: ${baby.name}`);
  }

  // Start with the slowest tears and mark to update them on this frame.
  g.run.babyCounters = baby.max;
  g.run.babyFrame = g.g.GetFrameCount();
});

// Bullet Baby
babyAddFunctionMap.set(550, () => {
  const numBombs = g.p.GetNumBombs();

  g.run.babyCounters = numBombs;
  g.p.AddBombs(99);
});

// Cursed Room Baby
babyAddFunctionMap.set(556, () => {
  g.l.AddCurse(LevelCurse.CURSED, false);
});

// Found Soul Baby
babyAddFunctionMap.set(RandomBabyType.FOUND_SOUL_BABY, () => {
  const numDarkEsaus = Isaac.CountEntities(undefined, EntityType.DARK_ESAU);
  if (numDarkEsaus > 0) {
    return;
  }

  const bottomLeftGridIndex = 92;
  const bottomLeftPosition = g.r.GetGridPosition(bottomLeftGridIndex);
  spawn(EntityType.DARK_ESAU, DarkEsauVariant.DARK_ESAU, 0, bottomLeftPosition);
});
