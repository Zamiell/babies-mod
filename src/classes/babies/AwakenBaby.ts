import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  game,
  GAME_FRAMES_PER_SECOND,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Constant Telekinesis effect. */
export class AwakenBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();

    if (gameFrameCount % GAME_FRAMES_PER_SECOND === 0) {
      useActiveItemTemp(g.p, CollectibleType.TELEKINESIS);
    }
  }
}
