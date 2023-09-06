import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, copyColor, spawnEffect } from "isaacscript-common";
import { Baby } from "../Baby";

/** If we spawn fires on every frame, it becomes too thick. */
const GAME_FRAMES_BETWEEN_SPAWNING_FIRES = 2;

const v = {
  room: {
    tearPtrHashes: new Set<PtrHash>(),
  },
};

/** Fire trail tears. */
export class EdBaby extends Baby {
  v = v;

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    if (!v.room.tearPtrHashes.has(ptrHash)) {
      return;
    }

    if (tear.FrameCount % GAME_FRAMES_BETWEEN_SPAWNING_FIRES !== 0) {
      return;
    }

    const fire = spawnEffect(EffectVariant.HOT_BOMB_FIRE, 0, tear.Position);
    fire.SpriteScale = Vector(0.5, 0.5);

    // Fade the fire so that it is easier to see everything.
    const color = fire.GetColor();
    const fadeAmount = 0.5;
    const newColor = copyColor(color);
    newColor.A = fadeAmount;
    fire.SetColor(newColor, 0, 0, true, true);
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    v.room.tearPtrHashes.add(ptrHash);
  }
}
