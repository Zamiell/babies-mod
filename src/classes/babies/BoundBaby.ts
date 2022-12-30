import {
  CollectibleType,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  game,
  GAME_FRAMES_PER_SECOND,
  sfxManager,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Monster Manual effect every N seconds. */
export class BoundBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    if (gameFrameCount % (num * GAME_FRAMES_PER_SECOND) === 0) {
      useActiveItemTemp(g.p, CollectibleType.MONSTER_MANUAL);
      sfxManager.Stop(SoundEffect.SATAN_GROW);
    }
  }
}
