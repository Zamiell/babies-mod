import { CacheFlag } from "isaac-typescript-definitions";
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";

export const usePillBabyFunctionMap = new Map<
  RandomBabyType,
  (player: EntityPlayer) => void
>();

// 483
usePillBabyFunctionMap.set(RandomBabyType.BUBBLES, (player: EntityPlayer) => {
  g.run.babyCounters++;
  player.AddCacheFlags(CacheFlag.DAMAGE);
  player.EvaluateItems();
});
