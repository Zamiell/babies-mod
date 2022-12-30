import {
  CollectibleType,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  game,
  GAME_FRAMES_PER_SECOND,
  inStartingRoom,
  sfxManager,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Dull Razor effect every 5 seconds. */
export class HeartBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();

    // Ignore the starting room.
    if (inStartingRoom()) {
      return;
    }

    if (gameFrameCount % (5 * GAME_FRAMES_PER_SECOND) === 0) {
      useActiveItemTemp(g.p, CollectibleType.DULL_RAZOR);
      sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
    }
  }
}
