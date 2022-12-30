import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, game, spawnEffect, VectorZero } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Leaves a trail of creep. */
export class PlagueBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();

    if (gameFrameCount % 5 === 0) {
      // Drip creep
      const creep = spawnEffect(
        EffectVariant.PLAYER_CREEP_RED,
        0,
        g.p.Position,
        VectorZero,
        g.p,
      );
      creep.Timeout = 240;
    }
  }
}
