import type { DamageFlag } from "isaac-typescript-definitions";
import {
  EffectVariant,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, getRandom, spawnEffect } from "isaacscript-common";
import { Baby } from "../Baby";

/** Tears have a 5% chance to create a Black Hole effect. */
export class AstronautBaby extends Baby {
  // 11
  @Callback(ModCallback.ENTITY_TAKE_DMG)
  entityTakeDmg(
    _entity: Entity,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    if (
      source.Type === EntityType.TEAR &&
      source.Entity !== undefined &&
      source.Entity.SubType === 1
    ) {
      const chance = getRandom(source.Entity.InitSeed);
      if (chance <= 0.05) {
        spawnEffect(
          EffectVariant.BLACK_HOLE,
          0,
          source.Position,
          source.Entity.Velocity,
          undefined,
          source.Entity.InitSeed,
        );
      }
    }

    return undefined;
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.SubType = 1; // Mark that we shot this tear.
  }
}
