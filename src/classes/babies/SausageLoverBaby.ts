import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  game,
  GAME_FRAMES_PER_SECOND,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Summons Monstro every 5 seconds. */
export class SausageLoverBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const roomClear = g.r.IsClear();

    if (
      gameFrameCount % (5 * GAME_FRAMES_PER_SECOND) === 0 &&
      // Monstro will target you if there are no enemies in the room (and this is unavoidable).
      !roomClear
    ) {
      useActiveItemTemp(g.p, CollectibleType.MONSTROS_TOOTH);
    }
  }
}
