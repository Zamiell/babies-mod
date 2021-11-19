import {
  addRoomClearCharge,
  BOMB_EXPLODE_FRAME,
  getRandom,
  nextSeed,
} from "isaacscript-common";
import g from "../globals";
import { getRandomOffsetPosition } from "../util";

export const postBombUpdateBabyFunctionMap = new Map<
  int,
  (bomb: EntityBomb) => void
>();

// Bomb Baby
postBombUpdateBabyFunctionMap.set(75, (bomb: EntityBomb) => {
  // 50% chance for bombs to have the D6 effect
  if (
    bomb.SpawnerType === EntityType.ENTITY_PLAYER &&
    bomb.FrameCount === BOMB_EXPLODE_FRAME
  ) {
    g.run.room.seed = nextSeed(g.run.room.seed);
    const d6chance = getRandom(g.run.room.seed);
    if (d6chance <= 0.5) {
      g.p.UseActiveItem(
        CollectibleType.COLLECTIBLE_D6,
        false,
        false,
        false,
        false,
      );
    }
  }
});

// Tongue Baby
postBombUpdateBabyFunctionMap.set(97, (bomb: EntityBomb) => {
  // Recharge bombs
  if (
    bomb.SpawnerType === EntityType.ENTITY_PLAYER &&
    bomb.FrameCount === BOMB_EXPLODE_FRAME
  ) {
    addRoomClearCharge(g.p, true);
  }
});

// Skull Baby
postBombUpdateBabyFunctionMap.set(211, (bomb: EntityBomb) => {
  const gameFrameCount = g.g.GetFrameCount();

  // Shockwave bombs
  if (
    bomb.SpawnerType === EntityType.ENTITY_PLAYER &&
    bomb.FrameCount === BOMB_EXPLODE_FRAME
  ) {
    for (let i = 0; i < 4; i++) {
      let velocity: Vector;
      if (i === 0) {
        velocity = Vector(1, 0); // Right
      } else if (i === 1) {
        velocity = Vector(0, 1); // Up
      } else if (i === 2) {
        velocity = Vector(-1, 0); // Left
      } else if (i === 3) {
        velocity = Vector(0, -1); // Down
      } else {
        error("velocity was never defined.");
      }

      g.run.room.tears.push({
        frame: gameFrameCount,
        position: bomb.Position,
        velocity: velocity.mul(30),
        num: 0,
      });
    }
  }
});

// Bony Baby
postBombUpdateBabyFunctionMap.set(284, (bomb: EntityBomb) => {
  const data = bomb.GetData();

  if (
    bomb.FrameCount === 1 && // Frame 0 does not work
    data.doubled === undefined
  ) {
    const position = getRandomOffsetPosition(bomb.Position, 15, bomb.InitSeed);
    const doubledBomb = g.g
      .Spawn(
        bomb.Type,
        bomb.Variant,
        position,
        bomb.Velocity,
        bomb.SpawnerEntity,
        bomb.SubType,
        bomb.InitSeed,
      )
      .ToBomb();
    if (doubledBomb !== undefined) {
      doubledBomb.Flags = bomb.Flags;
      doubledBomb.IsFetus = bomb.IsFetus;
      if (bomb.IsFetus) {
        // There is a bug where Dr. Fetus bombs that are doubled have twice as long of a cooldown
        doubledBomb.SetExplosionCountdown(28);
      }
      doubledBomb.ExplosionDamage = bomb.ExplosionDamage;
      doubledBomb.RadiusMultiplier = bomb.RadiusMultiplier;
      doubledBomb.GetData().doubled = true;
    }
  }
});

// Barbarian Baby
postBombUpdateBabyFunctionMap.set(344, (bomb: EntityBomb) => {
  if (
    bomb.SpawnerType === EntityType.ENTITY_PLAYER &&
    bomb.FrameCount === BOMB_EXPLODE_FRAME
  ) {
    g.r.MamaMegaExplossion();
  }
});

// Orange Ghost Baby
postBombUpdateBabyFunctionMap.set(373, (bomb: EntityBomb) => {
  if (bomb.FrameCount === 1 && bomb.Variant !== BombVariant.BOMB_SUPERTROLL) {
    g.g.Spawn(
      bomb.Type,
      BombVariant.BOMB_SUPERTROLL,
      bomb.Position,
      bomb.Velocity,
      bomb.SpawnerEntity,
      bomb.SubType,
      bomb.InitSeed,
    );
    bomb.Remove();
  }
});
