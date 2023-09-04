import {
  CacheFlag,
  CollectibleType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  GAME_FRAMES_PER_SECOND,
  ModCallbackCustom,
  game,
  hasCollectible,
} from "isaacscript-common";
import { Baby } from "../Baby";

const GAME_FRAMES_BETWEEN_STAT_CHANGE = GAME_FRAMES_PER_SECOND / 15;
const STAT_CHANGE_AMOUNT = 0.01;
const MIN_SHOT_SPEED_MODIFIER = -0.4;
const MAX_SHOT_SPEED_MODIFIER = 1;

const v = {
  run: {
    shotSpeedIncreasing: true,
    shotSpeedModifier: 0,
  },
};

/** Low shot speed. */
export class BlistersBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(
      player,
      CollectibleType.TECHNOLOGY, // 68
      CollectibleType.MOMS_KNIFE, // 114
      CollectibleType.BRIMSTONE, // 118
      CollectibleType.EPIC_FETUS, // 168
      CollectibleType.LUDOVICO_TECHNIQUE, // 329
    );
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    if (gameFrameCount % GAME_FRAMES_BETWEEN_STAT_CHANGE !== 0) {
      return;
    }

    if (v.run.shotSpeedIncreasing) {
      v.run.shotSpeedModifier += STAT_CHANGE_AMOUNT;
      if (v.run.shotSpeedModifier >= MAX_SHOT_SPEED_MODIFIER) {
        v.run.shotSpeedIncreasing = false;
      }
    } else {
      v.run.shotSpeedModifier -= STAT_CHANGE_AMOUNT;
      if (v.run.shotSpeedModifier <= MIN_SHOT_SPEED_MODIFIER) {
        v.run.shotSpeedIncreasing = true;
      }
    }

    player.AddCacheFlags(CacheFlag.SHOT_SPEED);
    player.EvaluateItems();
  }

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.SHOT_SPEED)
  evaluateCacheRange(player: EntityPlayer): void {
    player.ShotSpeed += v.run.shotSpeedModifier;
  }
}
