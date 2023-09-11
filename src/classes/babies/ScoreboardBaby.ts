import type { DamageFlag } from "isaac-typescript-definitions";
import { LevelStage, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  GAME_FRAMES_PER_MINUTE,
  ModCallbackCustom,
  game,
  isSelfDamage,
  onStageOrHigher,
} from "isaacscript-common";
import { drawTimer } from "../../timer";
import { Baby } from "../Baby";

const v = {
  run: {
    timer: null as int | null,
  },
};

/** Dies 1 minute after getting hit. */
export class ScoreboardBaby extends Baby {
  v = v;

  override isValid(): boolean {
    // It would be too difficult on the later floors.
    return !onStageOrHigher(LevelStage.BLUE_WOMB);
  }

  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    drawTimer(v.run.timer);
  }

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
