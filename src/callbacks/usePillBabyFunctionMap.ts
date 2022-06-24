import { CacheFlag } from "isaac-typescript-definitions";
import g from "../globals";

export const usePillBabyFunctionMap = new Map<
  int,
  (player: EntityPlayer) => void
>();

// Bubbles Baby
usePillBabyFunctionMap.set(483, (player: EntityPlayer) => {
  g.run.babyCounters += 1;
  player.AddCacheFlags(CacheFlag.DAMAGE);
  player.EvaluateItems();
});
