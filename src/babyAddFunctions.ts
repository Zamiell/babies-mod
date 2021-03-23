import g from "./globals";
import * as misc from "./misc";

const functionMap = new Map<int, () => void>();
export default functionMap;

// Gold Baby
functionMap.set(15, () => {
  g.p.AddGoldenBomb();
  g.p.AddGoldenKey();
  g.p.AddGoldenHearts(12);
});

// Rage Baby
functionMap.set(31, () => {
  g.p.AddBombs(99);
});

// Noose Baby
functionMap.set(39, () => {
  // Local variables
  const [, baby] = misc.getCurrentBaby();
  if (baby.time === undefined) {
    error(`The "time" attribute was not defined for ${baby.name}.`);
  }

  // Don't shoot when the timer reaches 0
  // Set the timer so that we don't take damage immediately upon reaching the floor
  g.run.babyCounters = g.g.GetFrameCount() + baby.time;
});

// Hive Baby
functionMap.set(40, () => {
  // The game only allows a maximum of 64 Blue Flies and Blue Spiders at one time
  g.p.AddBlueFlies(64, g.p.Position, null);
  for (let i = 0; i < 64; i++) {
    g.p.AddBlueSpider(g.p.Position);
  }
});

// Whore Baby
functionMap.set(43, () => {
  g.run.babyExplosions = [];
});

// Dark Baby
functionMap.set(48, () => {
  // Temporary blindness
  g.run.babySprite = Sprite();
  g.run.babySprite.Load("gfx/misc/black.anm2", true);
  g.run.babySprite.SetFrame("Default", 0);
});

// Hopeless Baby
functionMap.set(125, () => {
  // Keys are hearts
  g.p.AddKeys(2);

  // Initialize the sprites
  g.run.babySprite = Sprite();
  g.run.babySprite.Load("gfx/custom-health/key.anm2", true);
  g.run.babySprite.SetFrame("Default", 0);
});

// Mohawk Baby
functionMap.set(138, () => {
  // Bombs are hearts
  g.p.AddBombs(2);

  // Initialize the sprites
  g.run.babySprite = Sprite();
  g.run.babySprite.Load("gfx/custom-health/bomb.anm2", true);
  g.run.babySprite.SetFrame("Default", 0);
});

// Aban Baby
functionMap.set(177, () => {
  // Coins are hearts
  g.p.AddCoins(2);
});

// Fang Demon Baby
functionMap.set(281, () => {
  // These items will cause a softlock, so just remove them from all pools as a quick fix
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE); // 114
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS); // 168
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG); // 229
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_TECH_X); // 395
});

// Vomit Baby
functionMap.set(341, () => {
  // Local variables
  const [, baby] = misc.getCurrentBaby();
  if (baby.time === undefined) {
    error(`The "time" attribute was not defined for ${baby.name}.`);
  }

  g.run.babyCounters = g.g.GetFrameCount() + baby.time;
});

// Cyborg Baby
functionMap.set(343, () => {
  Isaac.ExecuteCommand("debug 7");
});

// Rabbit Baby
functionMap.set(350, () => {
  // Local variables
  const [, baby] = misc.getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  g.run.babyFrame = g.g.GetFrameCount() + baby.num;
});

// Yellow Princess Baby
functionMap.set(375, () => {
  // This is the third item given, so we have to handle it manually
  g.p.AddCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE, 0, false);
  misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_FLAT_STONE);
});

// Imp Baby
functionMap.set(386, () => {
  // Local variables
  const [, baby] = misc.getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  // Start the direction at left
  g.run.babyCounters = ButtonAction.ACTION_SHOOTLEFT;
  g.run.babyFrame = g.g.GetFrameCount() + baby.num;
});

// Dream Knight Baby
functionMap.set(393, () => {
  g.p.AddCollectible(CollectibleType.COLLECTIBLE_KEY_BUM, 0, false);
});

// Blurred Baby
functionMap.set(407, () => {
  // This is the third item given, so we have to handle it manually
  g.p.AddCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE, 0, false);
  misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_FLAT_STONE);
});

// Rich Baby
functionMap.set(424, () => {
  g.p.AddCoins(99);
});

// Twitchy Baby
functionMap.set(511, () => {
  // Local variables
  const [, baby] = misc.getCurrentBaby();
  if (baby.max === undefined) {
    error(`The "max" attribute was not defined for ${baby.name}.`);
  }

  // Start with the slowest tears and mark to update them on this frame
  g.run.babyCounters = baby.max;
  g.run.babyFrame = g.g.GetFrameCount();
});
