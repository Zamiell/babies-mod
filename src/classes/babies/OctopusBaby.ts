import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, VectorZero, game, spawnEffect } from "isaacscript-common";
import { Baby } from "../Baby";

/** If we spawn creep on every frame, it becomes too thick. */
const GAME_FRAMES_BETWEEN_SPAWNING_CREEP = 5;

const CREEP_TIMEOUT = 240;

const v = {
  room: {
    tearsPtrHashes: new Set<PtrHash>(),
  },
};

/** Black creep tears. */
export class OctopusBaby extends Baby {
  v = v;

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    if (!v.room.tearsPtrHashes.has(ptrHash)) {
      return;
    }

    const gameFrameCount = game.GetFrameCount();
    if (gameFrameCount % GAME_FRAMES_BETWEEN_SPAWNING_CREEP !== 0) {
      return;
    }

    const creep = spawnEffect(
      EffectVariant.PLAYER_CREEP_BLACK,
      0,
      tear.Position,
      VectorZero,
      tear,
    );
    creep.Timeout = CREEP_TIMEOUT;
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    v.room.tearsPtrHashes.add(ptrHash);
  }
}
