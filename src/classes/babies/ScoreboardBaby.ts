import type { DamageFlag } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  GAME_FRAMES_PER_MINUTE,
  isSelfDamage,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    timer: null as int | null,
  },
};

/** Dies 1 minute after getting hit. */
export class ScoreboardBaby extends Baby {
  v = v;

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    _player: EntityPlayer,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
  ): boolean | undefined {
    const gameFrameCount = game.GetFrameCount();

    if (v.run.timer !== null) {
      return;
    }

    if (isSelfDamage(damageFlags)) {
      return;
    }

    v.run.timer = gameFrameCount + GAME_FRAMES_PER_MINUTE;

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();

    if (v.run.timer !== null) {
      const remainingGameFrames = v.run.timer - gameFrameCount;
      if (remainingGameFrames <= 0) {
        v.run.timer = null;
        player.Kill();
      }
    }
  }
}
