import { CacheFlag, PillColor, PillEffect } from "isaac-typescript-definitions";
import { game } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { getCurrentBabyDescription } from "../utilsBaby";

export const postPickupCollectBabyFunctionMap = new Map<
  RandomBabyType,
  () => void
>();

// 147
postPickupCollectBabyFunctionMap.set(RandomBabyType.BLUEBIRD, () => {
  g.p.UsePill(PillEffect.PARALYSIS, PillColor.NULL);
});

// 167
postPickupCollectBabyFunctionMap.set(RandomBabyType.WORRY, () => {
  const gameFrameCount = game.GetFrameCount();
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  // Teleport 2 frames in the future so that we can put an item in the Schoolbag.
  if (g.run.babyFrame === 0) {
    g.run.babyFrame = gameFrameCount + baby.num;
  }
});

// 473
postPickupCollectBabyFunctionMap.set(RandomBabyType.ROBBERMASK, () => {
  // Touching pickups gives extra damage.
  g.run.babyCounters++;
  g.p.AddCacheFlags(CacheFlag.DAMAGE);
  g.p.EvaluateItems();
});
