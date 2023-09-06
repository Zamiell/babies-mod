import {
  CacheFlag,
  CollectibleType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  MIN_PLAYER_SPEED_STAT,
  ModCallbackCustom,
  game,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    mustJumpOnFrame: 0,
  },
};

/** Starts with How to Jump; must jump often. */
export class RabbitBaby extends Baby {
  v = v;

  override onAdd(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    v.run.mustJumpOnFrame = gameFrameCount + num;
  }

  // 3
  @Callback(ModCallback.POST_USE_ITEM, CollectibleType.HOW_TO_JUMP)
  postUseItemHowToJump(): boolean | undefined {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    v.run.mustJumpOnFrame = gameFrameCount + num;
    return undefined;
  }

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.SPEED)
  evaluateCacheSpeed(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();

    if (gameFrameCount >= v.run.mustJumpOnFrame) {
      // Speed has a lower bound, so we cannot set it lower than this.
      player.MoveSpeed = MIN_PLAYER_SPEED_STAT;
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    player.AddCacheFlags(CacheFlag.SPEED);
    player.EvaluateItems();
  }
}
