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

/** Mega Bean effect every 5 seconds. */
export class PuffBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const hearts = g.p.GetHearts();
    const soulHearts = g.p.GetSoulHearts();
    const boneHearts = g.p.GetBoneHearts();

    if (bigChestExists()) {
      return;
    }

    // Prevent dying animation softlocks.
    if (hearts + soulHearts + boneHearts === 0) {
      return;
    }

    if (gameFrameCount % (5 * GAME_FRAMES_PER_SECOND) === 0) {
      useActiveItemTemp(g.p, CollectibleType.MEGA_BEAN);
    }
  }
}
