import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback, game } from "isaacscript-common";
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

/** Shockwave tears. */
export class VoxdogBaby extends Baby {
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

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FIRE_DELAY)
  evaluateCacheFireDelay(player: EntityPlayer): void {
    player.MaxFireDelay = math.ceil(player.MaxFireDelay * 2);
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const gameFrameCount = game.GetFrameCount();

    tear.Remove();

    this.v.room.shockwaves.push({
      gameFrameSpawned: gameFrameCount,
      position: tear.Position,
      velocity: tear.Velocity.Normalized().mul(30),
    });
  }
}
