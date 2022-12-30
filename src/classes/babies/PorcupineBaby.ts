import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  game,
  GAME_FRAMES_PER_SECOND,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

// eslint-disable-next-line isaacscript/complete-sentences-jsdoc
/** Wait What? effect every 5 seconds. */
export class PorcupineBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();

    if (gameFrameCount % (5 * GAME_FRAMES_PER_SECOND) === 0) {
      useActiveItemTemp(g.p, CollectibleType.WAIT_WHAT);
    }
  }
}
