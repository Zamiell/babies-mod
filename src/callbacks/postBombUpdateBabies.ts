import g from "../globals";
import * as misc from "../misc";

const functionMap = new Map<int, (bomb: EntityBomb) => void>();
export default functionMap;

// Bomb Baby
functionMap.set(75, (bomb: EntityBomb) => {
  // 50% chance for bombs to have the D6 effect
  if (
    bomb.SpawnerType === EntityType.ENTITY_PLAYER &&
    bomb.FrameCount === 51 // Bombs explode on the 51st frame exactly
  ) {
    g.run.room.RNG = misc.incrementRNG(g.run.room.RNG);
    math.randomseed(g.run.room.RNG);
    const d6chance = math.random(1, 2);
    if (d6chance === 2) {
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
functionMap.set(97, (bomb: EntityBomb) => {
  // Recharge bombs
  if (
    bomb.SpawnerType === EntityType.ENTITY_PLAYER &&
    bomb.FrameCount === 51 // Bombs explode on the 51st frame exactly
  ) {
    misc.addCharge();
    if (g.racingPlusEnabled) {
      // This is a no-op if the player does not have the Schoolbag or if the Schoolbag is empty
      RacingPlusSchoolbag.AddCharge(true);
    }
  }
});

// Skull Baby
functionMap.set(211, (bomb: EntityBomb) => {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  // Shockwave bombs
  if (
    bomb.SpawnerType === EntityType.ENTITY_PLAYER &&
    bomb.FrameCount === 51 // Bombs explode on the 51st frame exactly
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
        velocity: velocity.__mul(30),
        num: 0,
      });
    }
  }
});

// Bony Baby
functionMap.set(284, (bomb: EntityBomb) => {
  // Local variables
  const data = bomb.GetData();

  if (
    bomb.FrameCount === 1 && // Frame 0 does not work
    data.doubled === undefined
  ) {
    const position = misc.getOffsetPosition(bomb.Position, 15, bomb.InitSeed);
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
    if (doubledBomb !== null) {
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
functionMap.set(344, (bomb: EntityBomb) => {
  if (
    bomb.SpawnerType === EntityType.ENTITY_PLAYER &&
    bomb.FrameCount === 51 // Bombs explode on the 51st frame exactly
  ) {
    g.r.MamaMegaExplossion();
  }
});

// Orange Ghost Baby
functionMap.set(373, (bomb: EntityBomb) => {
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
