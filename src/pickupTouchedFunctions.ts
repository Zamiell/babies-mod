import g from "./globals";
import { getCurrentBaby } from "./misc";

const functionMap = new Map<int, () => void>();
export default functionMap;

// Cute Baby
functionMap.set(11, () => {
  // -1 damage per pickup taken
  g.run.babyCounters += 1;
  g.p.AddCacheFlags(CacheFlag.CACHE_DAMAGE);
  g.p.EvaluateItems();
});

// Bluebird Baby
functionMap.set(147, () => {
  // Touching pickups causes paralysis (2/2)
  g.p.UsePill(PillEffect.PILLEFFECT_PARALYSIS, PillColor.PILL_NULL);
});

// Worry Baby
functionMap.set(167, () => {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  // Touching pickups causes teleportation (1/2)
  // Teleport 2 frames in the future so that we can put an item in the Schoolbag
  if (g.run.babyFrame === 0) {
    g.run.babyFrame = gameFrameCount + baby.num;
  }
});

// Corrupted Baby
functionMap.set(307, () => {
  // Touching items/pickups causes damage (2/2)
  g.p.TakeDamage(1, 0, EntityRef(g.p), 0);
});

// Robbermask Baby
functionMap.set(473, () => {
  // Touching pickups gives extra damage
  g.run.babyCounters += 1;
  g.p.AddCacheFlags(CacheFlag.CACHE_DAMAGE);
  g.p.EvaluateItems();
});
