import g from "../globals";

const functionMap = new Map<int, () => void>();
export default functionMap;

// Bubbles Baby
functionMap.set(483, () => {
  g.run.babyCounters += 1;
  g.p.AddCacheFlags(CacheFlag.CACHE_DAMAGE);
  g.p.EvaluateItems();
});
