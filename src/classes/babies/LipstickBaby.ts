import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  GAME_FRAMES_PER_SECOND,
  ModCallbackCustom,
  game,
  getDefaultPlayerStat,
} from "isaacscript-common";
import { Baby } from "../Baby";

const GAME_FRAMES_BETWEEN_STAT_CHANGE = 2 * GAME_FRAMES_PER_SECOND;
const MIN_RANGE_MODIFIER = -4;
const MAX_RANGE_MODIFIER = 6;

const v = {
  run: {
    rangeIncreasing: true,
    rangeModifier: 0,
  },
};

/** Range oscillates. */
export class LipstickBaby extends Baby {
  v = v;

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    if (gameFrameCount % GAME_FRAMES_BETWEEN_STAT_CHANGE !== 0) {
      return;
    }

    if (v.run.rangeIncreasing) {
      v.run.rangeModifier++;
      if (v.run.rangeModifier >= MAX_RANGE_MODIFIER) {
        v.run.rangeIncreasing = false;
      }
    } else {
      v.run.rangeModifier--;
      if (v.run.rangeModifier <= MIN_RANGE_MODIFIER) {
        v.run.rangeIncreasing = true;
      }
    }

    player.AddCacheFlags(CacheFlag.RANGE);
    player.EvaluateItems();
  }

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.RANGE)
  evaluateCacheRange(player: EntityPlayer): void {
    player.TearRange += v.run.rangeModifier;
  }
}

Isaac.DebugString(`GETTING HERE - ${getDefaultPlayerStat(CacheFlag.RANGE)}`);
