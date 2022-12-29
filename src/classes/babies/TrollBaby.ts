import { BombVariant, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  game,
  GAME_FRAMES_PER_SECOND,
  spawnBomb,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Spawns a Troll Bomb every N seconds. */
export class TrollBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  private postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();

    if (gameFrameCount % (3 * GAME_FRAMES_PER_SECOND) === 0) {
      spawnBomb(BombVariant.TROLL, 0, g.p.Position);
    }
  }
}
