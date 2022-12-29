import {
  CacheFlag,
  DamageFlagZero,
  PillColor,
  PillEffect,
} from "isaac-typescript-definitions";
import { game } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { getCurrentBabyDescription } from "../utils";

export const postPickupCollectBabyFunctionMap = new Map<
  RandomBabyType,
  () => void
>();

// 147
postPickupCollectBabyFunctionMap.set(RandomBabyType.BLUEBIRD, () => {
  // Touching pickups causes paralysis (2/2).
  g.p.UsePill(PillEffect.PARALYSIS, PillColor.NULL);
});

// 167
postPickupCollectBabyFunctionMap.set(RandomBabyType.WORRY, () => {
  const gameFrameCount = game.GetFrameCount();
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  // Touching pickups causes teleportation (1/2). Teleport 2 frames in the future so that we can put
  // an item in the Schoolbag.
  if (g.run.babyFrame === 0) {
    g.run.babyFrame = gameFrameCount + baby.num;
  }
});

// 307
postPickupCollectBabyFunctionMap.set(RandomBabyType.CORRUPTED, () => {
  // Touching items/pickups causes damage (2/2).
  g.p.TakeDamage(1, DamageFlagZero, EntityRef(g.p), 0);
});

// 473
postPickupCollectBabyFunctionMap.set(RandomBabyType.ROBBERMASK, () => {
  // Touching pickups gives extra damage.
  g.run.babyCounters++;
  g.p.AddCacheFlags(CacheFlag.DAMAGE);
  g.p.EvaluateItems();
});
