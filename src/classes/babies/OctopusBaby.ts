import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, VectorZero, game, spawnEffect } from "isaacscript-common";
import { Baby } from "../Baby";

/** Black creep tears. */
export class OctopusBaby extends Baby {
  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const gameFrameCount = game.GetFrameCount();

    if (
      tear.SubType === 1 &&
      gameFrameCount % 5 === 0 // If we spawn creep on every frame, it becomes too thick.
    ) {
      const creep = spawnEffect(
        EffectVariant.PLAYER_CREEP_BLACK,
        0,
        tear.Position,
        VectorZero,
        tear,
      );
      creep.Timeout = 240;
    }
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.SubType = 1; // Mark that we shot this tear.
  }
}
