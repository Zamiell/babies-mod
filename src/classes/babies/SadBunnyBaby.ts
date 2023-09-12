import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback, isMissedTear, repeat } from "isaacscript-common";
import {
  getBabyPlayerFromEntity,
  isValidForMissedTearsEffect,
} from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    numTearHits: 0,
  },

  room: {
    tearPtrHashes: new Set<PtrHash>(),
  },
};

/** Accuracy increases tear rate. */
export class SadBunnyBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    return isValidForMissedTearsEffect(player);
  }

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FIRE_DELAY)
  evaluateCacheFireDelay(player: EntityPlayer): void {
    repeat(v.run.numTearHits, () => {
      player.MaxFireDelay--;
    });

    // Prevent the tears from getting too ridiculous, which looks buggy.
    player.MaxFireDelay = Math.max(1, player.MaxFireDelay);
  }

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    if (!v.room.tearPtrHashes.has(ptrHash)) {
      return;
    }

    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    if (!isMissedTear(tear)) {
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
    if (!v.room.tearPtrHashes.has(ptrHash)) {
      return;
    }

    const player = getBabyPlayerFromEntity(tear);
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
    v.room.tearPtrHashes.add(ptrHash);
  }
}
