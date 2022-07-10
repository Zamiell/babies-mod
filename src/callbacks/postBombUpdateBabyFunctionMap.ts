import {
  BombVariant,
  CollectibleType,
  Direction,
  EntityType,
} from "isaac-typescript-definitions";
import {
  addRoomClearCharge,
  BOMB_EXPLODE_FRAME,
  directionToVector,
  game,
  getRandom,
  spawnBomb,
  useActiveItemTemp,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";
import { getRandomOffsetPosition } from "../utils";

const SHOCKWAVE_BOMB_VELOCITY_MULTIPLIER = 30;

const SHOCKWAVE_BOMB_VELOCITIES: readonly Vector[] = [
  directionToVector(Direction.LEFT).mul(SHOCKWAVE_BOMB_VELOCITY_MULTIPLIER), // 0
  directionToVector(Direction.UP).mul(SHOCKWAVE_BOMB_VELOCITY_MULTIPLIER), // 1
  directionToVector(Direction.RIGHT).mul(SHOCKWAVE_BOMB_VELOCITY_MULTIPLIER), // 2
  directionToVector(Direction.DOWN).mul(SHOCKWAVE_BOMB_VELOCITY_MULTIPLIER), // 3
];

export const postBombUpdateBabyFunctionMap = new Map<
  RandomBabyType,
  (bomb: EntityBomb) => void
>();

// 75
postBombUpdateBabyFunctionMap.set(RandomBabyType.BOMB, (bomb: EntityBomb) => {
  // 50% chance for bombs to have the D6 effect.
  if (
    bomb.SpawnerType === EntityType.PLAYER &&
    bomb.FrameCount === BOMB_EXPLODE_FRAME
  ) {
    const d6chance = getRandom(g.run.room.rng);
    if (d6chance <= 0.5) {
      useActiveItemTemp(g.p, CollectibleType.D6);
    }
  }
});

// 97
postBombUpdateBabyFunctionMap.set(RandomBabyType.TONGUE, (bomb: EntityBomb) => {
  // Recharge bombs
  if (
    bomb.SpawnerType === EntityType.PLAYER &&
    bomb.FrameCount === BOMB_EXPLODE_FRAME
  ) {
    addRoomClearCharge(g.p, false);
  }
});

// 211
postBombUpdateBabyFunctionMap.set(RandomBabyType.SKULL, (bomb: EntityBomb) => {
  const gameFrameCount = game.GetFrameCount();

  if (
    bomb.SpawnerType !== EntityType.PLAYER ||
    bomb.FrameCount !== BOMB_EXPLODE_FRAME
  ) {
    return;
  }

  // Shockwave bombs
  for (const velocity of SHOCKWAVE_BOMB_VELOCITIES) {
    g.run.room.tears.push({
      frame: gameFrameCount,
      position: bomb.Position,
      velocity,
      num: 0,
    });
  }
});

// 284
postBombUpdateBabyFunctionMap.set(RandomBabyType.BONY, (bomb: EntityBomb) => {
  const data = bomb.GetData();

  if (
    bomb.FrameCount === 1 && // Frame 0 does not work
    data["doubled"] === undefined
  ) {
    const position = getRandomOffsetPosition(bomb.Position, 15, bomb.InitSeed);
    const doubledBomb = spawnBomb(
      bomb.Variant,
      bomb.SubType,
      position,
      bomb.Velocity,
      bomb.SpawnerEntity,
      bomb.InitSeed,
    );
    doubledBomb.Flags = bomb.Flags;
    doubledBomb.IsFetus = bomb.IsFetus;
    doubledBomb.ExplosionDamage = bomb.ExplosionDamage;
    doubledBomb.RadiusMultiplier = bomb.RadiusMultiplier;
    const doubledBombData = doubledBomb.GetData();
    doubledBombData["doubled"] = true;

    // There is a bug where Dr. Fetus bombs that are doubled have twice as long of a cooldown.
    if (bomb.IsFetus) {
      doubledBomb.SetExplosionCountdown(28);
    }
  }
});

// 344
postBombUpdateBabyFunctionMap.set(
  RandomBabyType.BARBARIAN,
  (bomb: EntityBomb) => {
    if (
      bomb.SpawnerType === EntityType.PLAYER &&
      bomb.FrameCount === BOMB_EXPLODE_FRAME
    ) {
      g.r.MamaMegaExplossion();
    }
  },
);

// 373
postBombUpdateBabyFunctionMap.set(
  RandomBabyType.ORANGE_GHOST,
  (bomb: EntityBomb) => {
    if (bomb.FrameCount === 1 && bomb.Variant !== BombVariant.MEGA_TROLL) {
      spawnBomb(
        BombVariant.MEGA_TROLL,
        bomb.SubType,
        bomb.Position,
        bomb.Velocity,
        bomb.SpawnerEntity,
        bomb.InitSeed,
      );
      bomb.Remove();
    }
  },
);
