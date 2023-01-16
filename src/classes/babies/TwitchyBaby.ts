import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  game,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Tear rate oscillates. */
export class TwitchyBaby extends Baby {
  /** Start with the slowest tears and mark to update them on this frame. */
  override onAdd(): void {
    const max = this.getAttribute("max");

    g.run.babyCounters = max;
    g.run.babyFrame = game.GetFrameCount();
  }

  // 1
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const gameFrameCount = game.GetFrameCount();
    const player = Isaac.GetPlayer();
    const num = this.getAttribute("num");
    const max = this.getAttribute("max");
    const min = this.getAttribute("min");

    if (gameFrameCount >= g.run.babyFrame) {
      g.run.babyFrame += num;
      if (g.run.babyBool) {
        // Tear rate is increasing.
        g.run.babyCounters++;
        if (g.run.babyCounters === max) {
          g.run.babyBool = false;
        }
      } else {
        // Tear rate is decreasing.
        g.run.babyCounters--;
        if (g.run.babyCounters === min) {
          g.run.babyBool = true;
        }
      }

      player.AddCacheFlags(CacheFlag.FIRE_DELAY);
      player.EvaluateItems();
    }
  }

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FIRE_DELAY)
  evaluateCacheFireDelay(player: EntityPlayer): void {
    player.MaxFireDelay += g.run.babyCounters;
  }
}
