import { ZERO_VECTOR } from "../constants";
import g from "../globals";

const functionMap = new Map<
  int,
  (tear: EntityTear, collider: Entity) => null | boolean
>();
export default functionMap;

// Mort Baby
functionMap.set(55, (tear: EntityTear, _collider: Entity) => {
  // Guppy tears
  if (tear.SubType === 1) {
    g.p.AddBlueFlies(1, g.p.Position, null);
  }

  return null;
});

// Gills Baby
functionMap.set(410, (tear: EntityTear, collider: Entity) => {
  // Splash tears
  if (tear.SubType === 1) {
    const creep = Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariant.PLAYER_CREEP_HOLYWATER,
      0,
      collider.Position,
      ZERO_VECTOR,
      g.p,
    ).ToEffect();
    if (creep !== null) {
      creep.Timeout = 120;
    }
  }

  return null;
});

// Sad Bunny Baby
functionMap.set(459, (tear: EntityTear, _collider: Entity) => {
  // Accuracy increases tear rate
  if (tear.SubType === 1) {
    g.run.babyCounters += 1;
    g.p.AddCacheFlags(CacheFlag.CACHE_FIREDELAY);
    g.p.EvaluateItems();
  }

  return null;
});
