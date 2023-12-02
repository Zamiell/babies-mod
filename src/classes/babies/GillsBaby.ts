import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, VectorZero, spawnEffect } from "isaacscript-common";
import { getBabyPlayerFromEntity, setTearColor } from "../../utils";
import { Baby } from "../Baby";

const LIGHT_CYAN = Color(0.7, 1.5, 2, 0.7, 1, 1, 1);

const v = {
  room: {
    tearPtrHashes: new Set<PtrHash>(),
  },
};

/** Splash tears. */
export class GillsBaby extends Baby {
  v = v;

  // 42
  @Callback(ModCallback.PRE_TEAR_COLLISION)
  preTearCollision(tear: EntityTear, collider: Entity): boolean | undefined {
    const ptrHash = GetPtrHash(tear);
    if (!v.room.tearPtrHashes.has(ptrHash)) {
      return undefined;
    }

    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return undefined;
    }

    const creep = spawnEffect(
      EffectVariant.PLAYER_CREEP_HOLY_WATER,
      0,
      collider.Position,
      VectorZero,
      player,
    );
    creep.Timeout = 120;

    return undefined;
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    setTearColor(tear, LIGHT_CYAN);

    const ptrHash = GetPtrHash(tear);
    v.room.tearPtrHashes.add(ptrHash);
  }
}
