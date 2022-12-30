import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  game,
  GAME_FRAMES_PER_SECOND,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Summons a Sprinkler every N seconds. */
export class MutatedFishBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    if (gameFrameCount % (num * GAME_FRAMES_PER_SECOND) === 0) {
      useActiveItemTemp(g.p, CollectibleType.SPRINKLER);
    }
  }
}
