import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  GAME_FRAMES_PER_SECOND,
  ModCallbackCustom,
  game,
} from "isaacscript-common";
import { Baby } from "../Baby";

const GAME_FRAMES_BETWEEN_STAT_CHANGE = 2 * GAME_FRAMES_PER_SECOND;
const MIN_FIRE_DELAY_MODIFIER = -4;
const MAX_FIRE_DELAY_MODIFIER = 4;

const v = {
  run: {
    fireDelayIncreasing: false,
    fireDelayModifier: 0,
  },
};

/** Tear rate oscillates. */
export class TwitchyBaby extends Baby {
  v = v;

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    if (gameFrameCount % GAME_FRAMES_BETWEEN_STAT_CHANGE !== 0) {
      return;
    }

    if (v.run.fireDelayIncreasing) {
      v.run.fireDelayModifier++;
      if (v.run.fireDelayModifier >= MAX_FIRE_DELAY_MODIFIER) {
        v.run.fireDelayIncreasing = false;
      }
    } else {
      v.run.fireDelayModifier--;
      if (v.run.fireDelayModifier <= MIN_FIRE_DELAY_MODIFIER) {
        v.run.fireDelayIncreasing = true;
      }
    }

    player.AddCacheFlags(CacheFlag.FIRE_DELAY);
    player.EvaluateItems();
  }

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FIRE_DELAY)
  evaluateCacheFireDelay(player: EntityPlayer): void {
    player.MaxFireDelay += v.run.fireDelayModifier;
  }
}
