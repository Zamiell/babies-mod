import {
  MAX_NUM_FAMILIARS,
  removeCollectibleFromItemTracker,
} from "isaacscript-common";
import { BABIES, RandomBabyType } from "./babies";
import g from "./globals";
import { initSprite } from "./sprite";
import { getCurrentBaby } from "./util";

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
  const [, baby] = getCurrentBaby();
  if (baby.time === undefined) {
    error(`The "time" attribute was not defined for: ${baby.name}`);
  }

  // Don't shoot when the timer reaches 0
  // Set the timer so that we don't take damage immediately upon reaching the floor
  g.run.babyCounters = g.g.GetFrameCount() + baby.time;
});

// Hive Baby
babyAddFunctionMap.set(40, () => {
  // The game caps the current number of familiars
  const halfMaxFamiliars = MAX_NUM_FAMILIARS / 2;
  g.p.AddBlueFlies(halfMaxFamiliars, g.p.Position, undefined);
  for (let i = 0; i < halfMaxFamiliars; i++) {
    g.p.AddBlueSpider(g.p.Position);
  }
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
  const baby = BABIES[107];
  if (baby.num === undefined) {
    error('Brownie Baby does not have a "num" property defined.');
  }

  for (const collectibleType of [
    CollectibleType.COLLECTIBLE_CUBE_OF_MEAT,
    CollectibleType.COLLECTIBLE_BALL_OF_BANDAGES,
  ]) {
    for (let i = 0; i < baby.num; i++) {
      g.p.AddCollectible(collectibleType);
      removeCollectibleFromItemTracker(collectibleType);
    }
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
  // These items will cause a softlock, so just remove them from all pools as a quick fix
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE); // 114
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS); // 168
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG); // 229
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_TECH_X); // 395
});

// Vomit Baby
babyAddFunctionMap.set(341, () => {
  const [, baby] = getCurrentBaby();
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
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  g.run.babyFrame = g.g.GetFrameCount() + baby.num;
});

// Yellow Princess Baby
babyAddFunctionMap.set(375, () => {
  // This is the third item given, so we have to handle it manually
  g.p.AddCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE);
  removeCollectibleFromItemTracker(CollectibleType.COLLECTIBLE_FLAT_STONE);
});

// Imp Baby
babyAddFunctionMap.set(386, () => {
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  // Start the direction at left
  g.run.babyCounters = ButtonAction.ACTION_SHOOTLEFT;
  g.run.babyFrame = g.g.GetFrameCount() + baby.num;
});

// Dream Knight Baby
babyAddFunctionMap.set(393, () => {
  g.p.AddCollectible(CollectibleType.COLLECTIBLE_KEY_BUM);
});

// Blurred Baby
babyAddFunctionMap.set(407, () => {
  // This is the third item given, so we have to handle it manually
  g.p.AddCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE);
  removeCollectibleFromItemTracker(CollectibleType.COLLECTIBLE_FLAT_STONE);
});

// Rich Baby
babyAddFunctionMap.set(424, () => {
  g.p.AddCoins(99);
});

// Twitchy Baby
babyAddFunctionMap.set(511, () => {
  const [, baby] = getCurrentBaby();
  if (baby.max === undefined) {
    error(`The "max" attribute was not defined for: ${baby.name}`);
  }

  // Start with the slowest tears and mark to update them on this frame
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
  g.l.AddCurse(LevelCurse.CURSE_OF_THE_CURSED, false);
});

// Found Soul Baby
babyAddFunctionMap.set(RandomBabyType.FOUND_SOUL_BABY, () => {
  const numDarkEsaus = Isaac.CountEntities(
    undefined,
    EntityType.ENTITY_DARK_ESAU,
  );
  if (numDarkEsaus > 0) {
    return;
  }

  const bottomLeftGridIndex = 92;
  const bottomLeftPosition = g.r.GetGridPosition(bottomLeftGridIndex);
  Isaac.Spawn(
    EntityType.ENTITY_DARK_ESAU,
    0,
    0,
    bottomLeftPosition,
    Vector.Zero,
    undefined,
  );
});
