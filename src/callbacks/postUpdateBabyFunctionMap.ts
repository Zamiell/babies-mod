import {
  BombVariant,
  CacheFlag,
  CollectibleType,
  DamageFlag,
  DamageFlagZero,
  EffectVariant,
  EntityGridCollisionClass,
  EntityPartition,
  EntityType,
  ProjectileVariant,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  DISTANCE_OF_GRID_TILE,
  game,
  GAME_FRAMES_PER_SECOND,
  sfxManager,
  spawn,
  spawnBomb,
  spawnEffect,
  spawnProjectile,
  useActiveItemTemp,
  VectorZero,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { pseudoRoomClearPostUpdate } from "../pseudoRoomClear";
import { EffectVariantCustom } from "../types/EffectVariantCustom";
import { getCurrentBabyDescription } from "../utilsBaby";

export const postUpdateBabyFunctionMap = new Map<RandomBabyType, () => void>();

// 320
postUpdateBabyFunctionMap.set(RandomBabyType.EXPLODING, () => {
  const gameFrameCount = game.GetFrameCount();

  // Check to see if we need to reset the cooldown (after we used the Kamikaze effect upon touching
  // an obstacle).
  if (g.run.babyFrame !== 0 && gameFrameCount >= g.run.babyFrame) {
    g.run.babyFrame = 0;
  }
});

// 332
postUpdateBabyFunctionMap.set(RandomBabyType.BUTTERFLY_2, () => {
  // Flight + can walk through walls.
  g.p.GridCollisionClass = EntityGridCollisionClass.NONE;
});

// 336
postUpdateBabyFunctionMap.set(RandomBabyType.HERO, () => {
  if (g.run.babyBool) {
    g.run.babyBool = false;
    g.p.AddCacheFlags(CacheFlag.DAMAGE); // 1
    g.p.AddCacheFlags(CacheFlag.FIRE_DELAY); // 2
    g.p.EvaluateItems();
  }
});

// 341
postUpdateBabyFunctionMap.set(RandomBabyType.VOMIT, () => {
  const gameFrameCount = game.GetFrameCount();
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  // Moving when the timer reaches 0 causes damage.
  const remainingTime = g.run.babyCounters - gameFrameCount;
  if (remainingTime <= 0) {
    g.run.babyCounters = gameFrameCount + baby.num; // Reset the timer

    const cutoff = 0.2;
    if (
      g.p.Velocity.X > cutoff ||
      g.p.Velocity.X < cutoff * -1 ||
      g.p.Velocity.Y > cutoff ||
      g.p.Velocity.Y < cutoff * -1
    ) {
      g.p.TakeDamage(1, DamageFlagZero, EntityRef(g.p), 0);
    }
  }
});

// 348
postUpdateBabyFunctionMap.set(RandomBabyType.FOURTONE, () => {
  const activeItem = g.p.GetActiveItem();

  // Keep the Candle always fully charged.
  if (activeItem === CollectibleType.CANDLE && g.p.NeedsCharge()) {
    g.p.FullCharge();
    sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
  }
});

// 349
postUpdateBabyFunctionMap.set(RandomBabyType.GRAYSCALE, () => {
  const gameFrameCount = game.GetFrameCount();

  if (gameFrameCount % (10 * GAME_FRAMES_PER_SECOND) === 0) {
    useActiveItemTemp(g.p, CollectibleType.DELIRIOUS);
  }
});

// 350
postUpdateBabyFunctionMap.set(RandomBabyType.RABBIT, () => {
  // Starts with How to Jump; must jump often.
  g.p.AddCacheFlags(CacheFlag.SPEED);
  g.p.EvaluateItems();
});

// 351
postUpdateBabyFunctionMap.set(RandomBabyType.MOUSE, () => {
  pseudoRoomClearPostUpdate(RandomBabyType.MOUSE);
});

// 374
postUpdateBabyFunctionMap.set(RandomBabyType.PINK_PRINCESS, () => {
  const gameFrameCount = game.GetFrameCount();

  if (gameFrameCount % (4 * GAME_FRAMES_PER_SECOND) === 0) {
    const randomPosition = Isaac.GetRandomPosition();
    spawnEffect(EffectVariant.MOM_FOOT_STOMP, 0, randomPosition);
  }
});

// 382
postUpdateBabyFunctionMap.set(RandomBabyType.BLUE_PIG, () => {
  const gameFrameCount = game.GetFrameCount();

  if (gameFrameCount % (5 * GAME_FRAMES_PER_SECOND) === 0) {
    spawnBomb(BombVariant.MEGA_TROLL, 0, g.p.Position);
  }
});

// 386
postUpdateBabyFunctionMap.set(RandomBabyType.IMP, () => {
  const gameFrameCount = game.GetFrameCount();
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  // If we rotate the knives on every frame, then it spins too fast.
  if (gameFrameCount < g.run.babyFrame) {
    return;
  }

  g.run.babyFrame += baby.num;

  // Rotate through the four directions.
  g.run.babyCounters++;
  if (g.run.babyCounters >= 8) {
    g.run.babyCounters = 4;
  }
});

// 388
postUpdateBabyFunctionMap.set(RandomBabyType.BLUE_WRESTLER, () => {
  // Enemies spawn projectiles upon death.
  for (let i = g.run.room.tears.length - 1; i >= 0; i--) {
    const tear = g.run.room.tears[i];
    if (tear === undefined) {
      error(`Failed to get tear number: ${i}`);
    }

    let velocity = g.p.Position.sub(tear.position);
    velocity = velocity.Normalized();
    velocity = velocity.mul(12);

    spawnProjectile(ProjectileVariant.NORMAL, 0, tear.position, velocity);

    tear.num--;
    if (tear.num === 0) {
      // The dead enemy has shot all of its tears, so we remove the tracking element for it.
      g.run.room.tears.splice(i, 1);
    }
  }
});

// 396
postUpdateBabyFunctionMap.set(RandomBabyType.PLAGUE, () => {
  const gameFrameCount = game.GetFrameCount();

  if (gameFrameCount % 5 === 0) {
    // Drip creep
    const creep = spawnEffect(
      EffectVariant.PLAYER_CREEP_RED,
      0,
      g.p.Position,
      VectorZero,
      g.p,
    );
    creep.Timeout = 240;
  }
});

// 401
postUpdateBabyFunctionMap.set(RandomBabyType.CORGI, () => {
  const gameFrameCount = game.GetFrameCount();

  if (gameFrameCount % (1.5 * GAME_FRAMES_PER_SECOND) === 0) {
    spawn(EntityType.FLY, 0, 0, g.p.Position);
  }
});

// 449
postUpdateBabyFunctionMap.set(RandomBabyType.MUTATED_FISH, () => {
  const gameFrameCount = game.GetFrameCount();

  if (gameFrameCount % (7 * GAME_FRAMES_PER_SECOND) === 0) {
    useActiveItemTemp(g.p, CollectibleType.SPRINKLER);
  }
});

// 462
postUpdateBabyFunctionMap.set(RandomBabyType.VOXDOG, () => {
  const gameFrameCount = game.GetFrameCount();

  // Shockwave tears
  for (let i = g.run.room.tears.length - 1; i >= 0; i--) {
    const tear = g.run.room.tears[i];
    if (tear === undefined) {
      error(`Failed to get tear number: ${i}`);
    }

    if ((gameFrameCount - tear.frame) % 2 === 0) {
      const explosion = spawnEffect(
        EffectVariant.ROCK_EXPLOSION,
        0,
        tear.position,
        VectorZero,
        g.p,
      );
      const index = g.r.GetGridIndex(tear.position);
      g.r.DestroyGrid(index, true);
      tear.position = tear.position.add(tear.velocity);
      sfxManager.Play(SoundEffect.ROCK_CRUMBLE, 0.5, 0);
      // (If the sound effect plays at full volume, it starts to get annoying.)

      // Make the shockwave deal damage to NPCs.
      const damage = g.p.Damage * 1.5;
      const entities = Isaac.FindInRadius(
        tear.position,
        DISTANCE_OF_GRID_TILE,
        EntityPartition.ENEMY,
      );
      for (const entity of entities) {
        entity.TakeDamage(
          damage,
          DamageFlag.EXPLOSION,
          EntityRef(explosion),
          2,
        );
      }
    }

    // Stop if it gets to a wall.
    if (!g.r.IsPositionInRoom(tear.position, 0)) {
      g.run.room.tears.splice(i, 1);
    }
  }
});

// 474
postUpdateBabyFunctionMap.set(RandomBabyType.SCOREBOARD, () => {
  const gameFrameCount = game.GetFrameCount();

  if (g.run.babyCounters !== 0) {
    const remainingTime = g.run.babyCounters - gameFrameCount;
    if (remainingTime <= 0) {
      g.run.babyCounters = 0;
      g.p.Kill();
    }
  }
});

// 485
postUpdateBabyFunctionMap.set(RandomBabyType.COOL_ORANGE, () => {
  const gameFrameCount = game.GetFrameCount();

  if (gameFrameCount % GAME_FRAMES_PER_SECOND === 0) {
    // Spawn a random rocket target.
    const target = spawnEffect(
      EffectVariantCustom.FETUS_BOSS_TARGET,
      0,
      Isaac.GetRandomPosition(),
    );
    const sprite = target.GetSprite();
    sprite.Play("Blink", true);
    // Target behavior and rocket behavior are handled in the PostEffectUpdate callback.
  }
});

// 500
postUpdateBabyFunctionMap.set(RandomBabyType.MERN, () => {
  const gameFrameCount = game.GetFrameCount();

  if (g.run.babyTears.frame !== 0 && gameFrameCount >= g.run.babyTears.frame) {
    g.run.babyTears.frame = 0;
    g.p.FireTear(g.p.Position, g.run.babyTears.velocity, false, true, false);
  }
});

// 508
postUpdateBabyFunctionMap.set(RandomBabyType.SAUSAGE_LOVER, () => {
  const gameFrameCount = game.GetFrameCount();
  const roomClear = g.r.IsClear();

  if (
    gameFrameCount % (5 * GAME_FRAMES_PER_SECOND) === 0 &&
    // Monstro will target you if there are no enemies in the room (and this is unavoidable).
    !roomClear
  ) {
    useActiveItemTemp(g.p, CollectibleType.MONSTROS_TOOTH);
  }
});
