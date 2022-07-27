import { CacheFlag, EffectVariant } from "isaac-typescript-definitions";
import { spawnEffect, VectorZero } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";

export const preTearCollisionBabyFunctionMap = new Map<
  RandomBabyType,
  (tear: EntityTear, collider: Entity) => boolean | undefined
>();

// 55
preTearCollisionBabyFunctionMap.set(
  RandomBabyType.MORT,
  (tear: EntityTear, _collider: Entity) => {
    // Guppy tears
    if (tear.SubType === 1) {
      g.p.AddBlueFlies(1, g.p.Position, undefined);
    }

    return undefined;
  },
);

// 410
preTearCollisionBabyFunctionMap.set(
  RandomBabyType.GILLS,
  (tear: EntityTear, collider: Entity) => {
    // Splash tears
    if (tear.SubType === 1) {
      const creep = spawnEffect(
        EffectVariant.PLAYER_CREEP_HOLY_WATER,
        0,
        collider.Position,
        VectorZero,
        g.p,
      );
      creep.Timeout = 120;
    }

    return undefined;
  },
);

// 459
preTearCollisionBabyFunctionMap.set(
  RandomBabyType.SAD_BUNNY,
  (tear: EntityTear, _collider: Entity) => {
    // Accuracy increases tear rate.
    if (tear.SubType === 1) {
      g.run.babyCounters++;
      g.p.AddCacheFlags(CacheFlag.FIRE_DELAY);
      g.p.EvaluateItems();
    }

    return undefined;
  },
);
