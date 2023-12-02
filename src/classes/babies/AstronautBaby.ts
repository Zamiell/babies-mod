import type { DamageFlag } from "isaac-typescript-definitions";
import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, getRandom, spawnEffect } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  room: {
    tearPtrHashes: new Set<PtrHash>(),
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
    const tear = source.Entity;
    if (tear === undefined) {
      return undefined;
    }

    const ptrHash = GetPtrHash(tear);
    if (!v.room.tearPtrHashes.has(ptrHash)) {
      return undefined;
    }

    const blackHoleChance = getRandom(tear.InitSeed);
    const num = this.getAttribute("num");

    if (blackHoleChance < num) {
      spawnEffect(
        EffectVariant.BLACK_HOLE,
        0,
        source.Position,
        tear.Velocity,
        undefined,
        tear.InitSeed,
      );
    }

    return undefined;
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    v.room.tearPtrHashes.add(ptrHash);
  }
}
