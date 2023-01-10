import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback, game, MIN_PLAYER_SPEED_STAT } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with How to Jump; must jump often. */
export class RabbitBaby extends Baby {
  override onAdd(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    g.run.babyFrame = gameFrameCount + num;
  }

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    g.p.AddCacheFlags(CacheFlag.SPEED);
    g.p.EvaluateItems();
  }

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.SPEED)
  evaluateCacheSpeed(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();

    if (gameFrameCount >= g.run.babyFrame) {
      // Speed has a lower bound, so we cannot set it lower than this.
      player.MoveSpeed = MIN_PLAYER_SPEED_STAT;
    }
  }
}
