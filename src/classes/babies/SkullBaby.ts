import { Direction, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  directionToVector,
  game,
  ModCallbackCustom,
} from "isaacscript-common";
import { RandomBabyType } from "../../enums/RandomBabyType";
import { g } from "../../globals";
import { BabyDescription } from "../../types/BabyDescription";
import { spawnShockwave } from "../../utils";
import { Baby } from "../Baby";

interface ShockWaveDescription {
  gameFrameSpawned: int;
  position: Vector;
  velocity: Vector;
}

const SHOCKWAVE_BOMB_VELOCITY_MULTIPLIER = 30;

const SHOCKWAVE_BOMB_VELOCITIES = [
  directionToVector(Direction.LEFT).mul(SHOCKWAVE_BOMB_VELOCITY_MULTIPLIER), // 0
  directionToVector(Direction.UP).mul(SHOCKWAVE_BOMB_VELOCITY_MULTIPLIER), // 1
  directionToVector(Direction.RIGHT).mul(SHOCKWAVE_BOMB_VELOCITY_MULTIPLIER), // 2
  directionToVector(Direction.DOWN).mul(SHOCKWAVE_BOMB_VELOCITY_MULTIPLIER), // 3
] as const;

/** Shockwave bombs. */
export class SkullBaby extends Baby {
  v = {
    room: {
      shockwaves: [] as ShockWaveDescription[],
    },
  };

  constructor(babyType: RandomBabyType, baby: BabyDescription) {
    super(babyType, baby);
    this.saveDataManager(this.v);
  }

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const player = Isaac.GetPlayer();

    for (let i = this.v.room.shockwaves.length - 1; i >= 0; i--) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const shockwave = this.v.room.shockwaves[i]!;

      if ((gameFrameCount - shockwave.gameFrameSpawned) % 2 === 0) {
        spawnShockwave(shockwave.position, player);
        shockwave.position = shockwave.position.add(shockwave.velocity);
      }

      // Stop if it gets to a wall.
      if (!g.r.IsPositionInRoom(shockwave.position, 0)) {
        this.v.room.shockwaves.splice(i, 1);
      }
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_BOMB_EXPLODED)
  postBombExploded(bomb: EntityBomb): void {
    const gameFrameCount = game.GetFrameCount();

    for (const velocity of SHOCKWAVE_BOMB_VELOCITIES) {
      this.v.room.shockwaves.push({
        gameFrameSpawned: gameFrameCount,
        position: bomb.Position,
        velocity,
      });
    }
  }
}
