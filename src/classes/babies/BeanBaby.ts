import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  game,
  GAME_FRAMES_PER_SECOND,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { bigChestExists } from "../../utils";
import { Baby } from "../Baby";

/** Constant Butter Bean effect. */
export class BeanBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  private postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();

    if (bigChestExists()) {
      return;
    }

    if (gameFrameCount % GAME_FRAMES_PER_SECOND === 0) {
      useActiveItemTemp(g.p, CollectibleType.BUTTER_BEAN);
    }
  }
}
