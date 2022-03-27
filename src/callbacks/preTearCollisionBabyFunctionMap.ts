import { VectorZero } from "isaacscript-common";
import g from "../globals";

export const preTearCollisionBabyFunctionMap = new Map<
  int,
  (tear: EntityTear, collider: Entity) => boolean | void
>();

// Mort Baby
preTearCollisionBabyFunctionMap.set(
  55,
  (tear: EntityTear, _collider: Entity) => {
    // Guppy tears
    if (tear.SubType === 1) {
      g.p.AddBlueFlies(1, g.p.Position, undefined);
    }
  },
);

// Gills Baby
preTearCollisionBabyFunctionMap.set(
  410,
  (tear: EntityTear, collider: Entity) => {
    // Splash tears
    if (tear.SubType === 1) {
      const creep = Isaac.Spawn(
        EntityType.ENTITY_EFFECT,
        EffectVariant.PLAYER_CREEP_HOLYWATER,
        0,
        collider.Position,
        VectorZero,
        g.p,
      ).ToEffect();
      if (creep !== undefined) {
        creep.Timeout = 120;
      }
    }
  },
);

// Sad Bunny Baby
preTearCollisionBabyFunctionMap.set(
  459,
  (tear: EntityTear, _collider: Entity) => {
    // Accuracy increases tear rate
    if (tear.SubType === 1) {
      g.run.babyCounters += 1;
      g.p.AddCacheFlags(CacheFlag.CACHE_FIREDELAY);
      g.p.EvaluateItems();
    }
  },
);
