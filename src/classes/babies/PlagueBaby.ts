import { EffectVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  ModCallbackCustom,
  spawnEffect,
  VectorZero,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Leaves a trail of creep. */
export class PlagueBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();

    if (gameFrameCount % 5 === 0) {
      const creep = spawnEffect(
        EffectVariant.PLAYER_CREEP_RED,
        0,
        player.Position,
        VectorZero,
        player,
      );
      creep.Timeout = 240;
    }
  }
}
