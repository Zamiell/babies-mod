import { Direction, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  directionToVector,
  ModCallbackCustom,
} from "isaacscript-common";
import {
  shockwavesPostUpdate,
  startShockwaveLine,
} from "../../features/shockwaves";
import { Baby } from "../Baby";

const SHOCKWAVE_BOMB_VELOCITY_MULTIPLIER = 30;

const SHOCKWAVE_BOMB_VELOCITIES = [
  directionToVector(Direction.LEFT).mul(SHOCKWAVE_BOMB_VELOCITY_MULTIPLIER), // 0
  directionToVector(Direction.UP).mul(SHOCKWAVE_BOMB_VELOCITY_MULTIPLIER), // 1
  directionToVector(Direction.RIGHT).mul(SHOCKWAVE_BOMB_VELOCITY_MULTIPLIER), // 2
  directionToVector(Direction.DOWN).mul(SHOCKWAVE_BOMB_VELOCITY_MULTIPLIER), // 3
] as const;

/** Shockwave bombs. */
export class SkullBaby extends Baby {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    shockwavesPostUpdate();
  }

  @CallbackCustom(ModCallbackCustom.POST_BOMB_EXPLODED)
  postBombExploded(bomb: EntityBomb): void {
    for (const velocity of SHOCKWAVE_BOMB_VELOCITIES) {
      startShockwaveLine(bomb.Position, velocity);
    }
  }
}
