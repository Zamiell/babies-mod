import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback, getPlayerFromEntity, repeat } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numTearHits: 0,
  },

  room: {
    playerTearPtrHashes: new Set<PtrHash>(),
  },
};

/** Accuracy increases tear rate. */
export class SadBunnyBaby extends Baby {
  v = v;

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FIRE_DELAY)
  evaluateCacheFireDelay(player: EntityPlayer): void {
    repeat(v.run.numTearHits, () => {
      player.MaxFireDelay--;
    });
  }

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    if (!v.room.playerTearPtrHashes.has(ptrHash)) {
      return;
    }

    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    // Tears will not die if they hit an enemy, but they will die if they hit a wall or object.
    if (!tear.IsDead()) {
      return;
    }

    // The streak ended.
    v.run.numTearHits = 0;
    player.AddCacheFlags(CacheFlag.FIRE_DELAY);
    player.EvaluateItems();
  }

  // 42
  @Callback(ModCallback.PRE_TEAR_COLLISION)
  preTearCollision(tear: EntityTear): boolean | undefined {
    const ptrHash = GetPtrHash(tear);
    if (!v.room.playerTearPtrHashes.has(ptrHash)) {
      return;
    }

    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return undefined;
    }

    v.run.numTearHits++;
    player.AddCacheFlags(CacheFlag.FIRE_DELAY);
    player.EvaluateItems();

    return undefined;
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    v.room.playerTearPtrHashes.add(ptrHash);
  }
}
