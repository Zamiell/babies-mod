import type { DamageFlag } from "isaac-typescript-definitions";
import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, getRandom, spawnEffect } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  room: {
    blackHoleTearPtrHashes: new Set<PtrHash>(),
  },
};

/** Tears have a N% chance to create a Black Hole effect. */
export class AstronautBaby extends Baby {
  v = v;

  // 11
  @Callback(ModCallback.ENTITY_TAKE_DMG)
  entityTakeDmg(
    _entity: Entity,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    if (source.Entity === undefined) {
      return;
    }

    const ptrHash = GetPtrHash(source.Entity);
    if (!v.room.blackHoleTearPtrHashes.has(ptrHash)) {
      return;
    }

    const chance = getRandom(source.Entity.InitSeed);
    const num = this.getAttribute("num");

    if (chance < num) {
      spawnEffect(
        EffectVariant.BLACK_HOLE,
        0,
        source.Position,
        source.Entity.Velocity,
        undefined,
        source.Entity.InitSeed,
      );
    }

    return undefined;
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    v.room.blackHoleTearPtrHashes.add(ptrHash);
  }
}
