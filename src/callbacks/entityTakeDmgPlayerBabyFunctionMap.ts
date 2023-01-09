import {
  BombVariant,
  CacheFlag,
  CardType,
  CollectibleType,
  DamageFlag,
  DamageFlagZero,
  DoorState,
  EntityType,
  PillColor,
  PillEffect,
  UseFlag,
} from "isaac-typescript-definitions";
import {
  addFlag,
  closeDoorFast,
  game,
  GAME_FRAMES_PER_SECOND,
  getDoors,
  getNPCs,
  getRandom,
  getRandomEnumValue,
  isSelfDamage,
  spawnBomb,
  spawnCard,
  useActiveItemTemp,
  VectorZero,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { mod } from "../mod";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";
import { getCurrentBabyDescription } from "../utilsBaby";

export const entityTakeDmgPlayerBabyFunctionMap = new Map<
  RandomBabyType,
  (
    player: EntityPlayer,
    amount: float,
    damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
    countdownFrames: int,
  ) => boolean | undefined
>();

// 293
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.BANSHEE, (player) => {
  useActiveItemTemp(player, CollectibleType.CRACK_THE_SKY);

  return undefined;
});

// 301
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.BLOODIED, (player) => {
  const roomClear = g.r.IsClear();

  /** Indexed by target room index. */
  const doorStateMap = new Map<int, DoorState>();

  for (const door of getDoors()) {
    doorStateMap.set(door.TargetRoomIndex, door.State);
  }

  const useFlags = addFlag(UseFlag.NO_ANIMATION, UseFlag.NO_ANNOUNCER_VOICE);
  player.UseCard(CardType.SOUL_CAIN, useFlags);

  if (roomClear) {
    return;
  }

  // Soul of Cain will open all of the doors, but we only want to open the doors to the red rooms.
  for (const door of getDoors()) {
    const oldState = doorStateMap.get(door.TargetRoomIndex);
    if (oldState === undefined) {
      continue;
    }

    if (oldState !== door.State) {
      closeDoorFast(door);
    }
  }

  return undefined;
});

// 308
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.X_MOUTH, (player) => {
  useActiveItemTemp(player, CollectibleType.MOVING_BOX);

  return undefined;
});

// 310
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.STARRY_EYED, (player) => {
  spawnCard(CardType.STARS, player.Position, VectorZero, player);

  return undefined;
});

// 315
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.PUZZLE, (player) => {
  useActiveItemTemp(player, CollectibleType.D6);

  return undefined;
});

// 318
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.FIREBALL,
  (_player, _amount, _damageFlags, damageSource) => {
    // Immunity from fires
    if (damageSource.Type === EntityType.FIREPLACE) {
      return false;
    }

    return undefined;
  },
);

// 330
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.TORTOISE, (_player) => {
  // 0.5x speed + 50% chance to ignore damage.
  const avoidChance = getRandom(g.run.rng);
  if (avoidChance <= 0.5) {
    return false;
  }

  return undefined;
});

// 322
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.SKINLESS,
  (player, amount, _damageFlags, _source, countdownFrames) => {
    // Take double damage
    if (!g.run.babyBool) {
      g.run.babyBool = true;
      player.TakeDamage(
        amount,
        DamageFlagZero,
        EntityRef(player),
        countdownFrames,
      );
      g.run.babyBool = false;
    }

    return undefined;
  },
);

// 323
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.BALLERINA, (player) => {
  // Summons a Restock Machine after 6 hits.
  g.run.babyCounters++;
  if (g.run.babyCounters === 6) {
    g.run.babyCounters = 0;
    useActiveItemTemp(player, CollectibleTypeCustom.CLOCKWORK_ASSEMBLY);
  }

  return undefined;
});

// 336
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.HERO, (_player) => {
  // We want to evaluate the cache, but we can't do it here because the damage is not applied yet,
  // so mark to do it later in the `POST_UPDATE` callback.
  g.run.babyBool = true;

  return undefined;
});

// 359
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.TANOOKI, (player) => {
  useActiveItemTemp(player, CollectibleType.MR_ME);

  return undefined;
});

// 366
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.FIERY, (player) => {
  player.ShootRedCandle(VectorZero);

  return undefined;
});

// 378
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.DARK_ELF, (player) => {
  useActiveItemTemp(player, CollectibleType.BOOK_OF_THE_DEAD);

  return undefined;
});

// 385
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.FAIRYMAN, (player) => {
  g.run.babyCounters++;
  player.AddCacheFlags(CacheFlag.DAMAGE);
  player.EvaluateItems();

  return undefined;
});

// 412
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.CATSUIT, (player) => {
  useActiveItemTemp(player, CollectibleType.GUPPYS_PAW);

  return undefined;
});

// 428
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.MAGIC_CAT, (player) => {
  const bomb = spawnBomb(BombVariant.GIGA, 0, player.Position);
  bomb.Visible = false;
  bomb.SetExplosionCountdown(0);

  return undefined;
});

// 435
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.CUP, (player) => {
  player.UseCard(CardType.AGAINST_HUMANITY);
  // (The animation will automatically be canceled by the damage.)

  return undefined;
});

// 438
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.BIG_MOUTH_2, (player) => {
  const baby = getCurrentBabyDescription();
  if (baby.requireNumHits === undefined) {
    error(`The "numHits" attribute was not defined for: ${baby.name}`);
  }

  g.run.babyCounters++;
  if (g.run.babyCounters === baby.requireNumHits) {
    g.run.babyCounters = 0;
    useActiveItemTemp(player, CollectibleType.MEGA_MUSH);
  }

  return undefined;
});

// 441
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.TV, (player) => {
  const baby = getCurrentBabyDescription();
  if (baby.requireNumHits === undefined) {
    error(`The "numHits" attribute was not defined for: ${baby.name}`);
  }

  g.run.babyCounters++;
  if (g.run.babyCounters === baby.requireNumHits) {
    g.run.babyCounters = 0;
    useActiveItemTemp(player, CollectibleType.MEGA_BLAST);
  }

  return undefined;
});

// 444
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.STEROIDS, (player) => {
  // Forget Me Now on 2nd hit (per room).
  g.run.babyCountersRoom++;
  if (g.run.babyCountersRoom >= 2) {
    useActiveItemTemp(player, CollectibleType.FORGET_ME_NOW);
  }

  return undefined;
});

// 446
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.ROJEN_WHITEFOX,
  (player) => {
    useActiveItemTemp(player, CollectibleType.BOOK_OF_SHADOWS);

    return undefined;
  },
);

// 456
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.HANDSOME_MR_FROG,
  (player) => {
    const baby = getCurrentBabyDescription();
    if (baby.num === undefined) {
      error(`The "num" attribute was not defined for: ${baby.name}`);
    }

    player.AddBlueFlies(baby.num, player.Position, undefined);

    return undefined;
  },
);

// 463
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.N_404, (player) => {
  player.AddCoins(-1);
  player.AddBombs(-1);
  player.AddKeys(-1);

  return undefined;
});

// 472
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.MUFFLERSCARF,
  (player) => {
    const freezeFrames = 5 * GAME_FRAMES_PER_SECOND;
    for (const npc of getNPCs()) {
      if (npc.IsVulnerableEnemy()) {
        npc.AddFreeze(EntityRef(player), freezeFrames);
      }
    }

    return undefined;
  },
);

// 474
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.SCOREBOARD,
  (
    _player: EntityPlayer,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
  ) => {
    const gameFrameCount = game.GetFrameCount();

    if (g.run.babyCounters !== 0) {
      return;
    }

    if (isSelfDamage(damageFlags)) {
      return;
    }

    // Death in 1 minute.
    g.run.babyCounters = gameFrameCount + 60 * 30;

    return undefined;
  },
);

// 488
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.EGG, (player) => {
  // Random pill effect on hit.
  const pillEffect = getRandomEnumValue(PillEffect, g.run.rng, [
    PillEffect.AMNESIA, // 25
    PillEffect.QUESTION_MARKS, // 31
  ]);

  player.UsePill(pillEffect, PillColor.NULL);
  // (The animation will automatically be canceled by the damage.)

  return undefined;
});

// 493
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.GLITTERY_PEACH,
  (player) => {
    const baby = getCurrentBabyDescription();
    if (baby.requireNumHits === undefined) {
      error(`The "numHits" attribute was not defined for: ${baby.name}`);
    }

    if (g.run.babyBool) {
      return;
    }

    // Teleport to the boss room after X hits (but only do it once per floor).
    g.run.babyCounters++;
    if (g.run.babyCounters === baby.requireNumHits) {
      g.run.babyBool = true;
      player.UseCard(CardType.EMPEROR);
    }

    return undefined;
  },
);

// 499
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.LAZY, (player) => {
  // Random card effect on hit.
  const exceptions = [CardType.SUICIDE_KING]; // It would be unfair to randomly die.
  const card = mod.getRandomCard(g.run.rng, exceptions);
  player.UseCard(card);

  return undefined;
});

// 506
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.REAPER, (player) => {
  // Spawns a random rune on hit.
  const rune = mod.getRandomRune(g.run.rng);
  spawnCard(rune, player.Position, VectorZero, player, g.run.rng);

  return undefined;
});

// 514
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.HOOLIGAN, (_player) => {
  const roomFrameCount = g.r.GetFrameCount();

  // Double enemies. Fix the bug where an enemy can sometimes spawn next to where the player spawns.
  if (roomFrameCount === 0) {
    return false;
  }

  return undefined;
});
