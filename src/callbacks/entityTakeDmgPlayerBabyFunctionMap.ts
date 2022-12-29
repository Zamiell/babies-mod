import {
  BombVariant,
  CacheFlag,
  CardType,
  CoinSubType,
  CollectibleType,
  DamageFlag,
  DamageFlagZero,
  DoorState,
  EffectVariant,
  EntityType,
  HeartSubType,
  KeySubType,
  PickupVariant,
  PillColor,
  PillEffect,
  SlotVariant,
  SoundEffect,
  UseFlag,
} from "isaac-typescript-definitions";
import {
  addFlag,
  closeDoorFast,
  game,
  GAME_FRAMES_PER_SECOND,
  getDoors,
  getEnumValues,
  getNPCs,
  getRandom,
  getRandomArrayElement,
  getRandomEnumValue,
  getRandomInt,
  isSelfDamage,
  openAllDoors,
  removeCollectibleFromItemTracker,
  repeat,
  sfxManager,
  spawn,
  spawnBomb,
  spawnCard,
  spawnCoin,
  spawnEffect,
  spawnHeart,
  spawnKey,
  spawnPickup,
  useActiveItemTemp,
  VectorZero,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { mod } from "../mod";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";
import { EntityDescription } from "../types/EntityDescription";
import { spawnRandomPickup, spawnSlotHelper } from "../utils";
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

// 32
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.CRY, (_player) => {
  // Enemies are fully healed on hit.
  for (const npc of getNPCs()) {
    if (npc.IsVulnerableEnemy()) {
      npc.HitPoints = npc.MaxHitPoints;
    }
  }

  return undefined;
});

// 33
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.YELLOW, (player) => {
  player.UsePill(PillEffect.LEMON_PARTY, PillColor.NULL);

  return undefined;
});

// 41
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.BUDDY, (player) => {
  const maxHearts = player.GetMaxHearts();

  // Removes a heart container on hit.
  if (!g.run.babyBool && maxHearts >= 2) {
    player.AddMaxHearts(-2, true);
    g.run.babyBool = true;
    useActiveItemTemp(player, CollectibleType.DULL_RAZOR);
    g.run.babyBool = false;
    return false;
  }

  return undefined;
});

// 46
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.BLINDING, (player) => {
  spawnCard(CardType.SUN, player.Position, VectorZero, player);

  return undefined;
});

// 50
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.REVENGE, (player) => {
  // Spawns a random heart on hit.
  const heartSubTypes = getEnumValues(HeartSubType);
  const heartSubType = getRandomArrayElement(heartSubTypes, g.run.rng);
  const seed = g.run.rng.Next();
  spawnHeart(heartSubType, player.Position, VectorZero, player, seed);

  return undefined;
});

// 56
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.APOLLYON, (player) => {
  player.UseCard(CardType.RUNE_BLACK);

  return undefined;
});

// 62
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.GOAT, (player) => {
  const baby = getCurrentBabyDescription();
  if (baby.numHits === undefined) {
    error(`The "numHits" attribute was not defined for: ${baby.name}`);
  }

  // Guaranteed Devil Room + Angel Room after N hits.
  g.run.babyCounters++;
  if (g.run.babyCounters >= baby.numHits && !g.run.babyBool) {
    g.run.babyBool = true;
    sfxManager.Play(SoundEffect.SATAN_GROW);
    player.AddCollectible(CollectibleType.GOAT_HEAD);
    removeCollectibleFromItemTracker(CollectibleType.GOAT_HEAD);
    player.AddCollectible(CollectibleType.DUALITY);
    removeCollectibleFromItemTracker(CollectibleType.DUALITY);
  }

  return undefined;
});

// 83
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.GHOUL, (player) => {
  useActiveItemTemp(player, CollectibleType.BOOK_OF_SECRETS);

  return undefined;
});

// 98
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.HALF_HEAD,
  (
    player,
    damageAmount,
    _damageFlags,
    _damageSource,
    damageCountdownFrames,
  ) => {
    // Take double damage
    if (!g.run.babyBool) {
      g.run.babyBool = true;
      player.TakeDamage(
        damageAmount,
        DamageFlagZero,
        EntityRef(player),
        damageCountdownFrames,
      );
      g.run.babyBool = false;
    }

    return undefined;
  },
);

// 101
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.D, (player) => {
  // Spawns creep on hit (improved).
  const creep = spawnEffect(
    EffectVariant.PLAYER_CREEP_RED,
    0,
    player.Position,
    VectorZero,
    player,
  );
  creep.Scale = 10;
  creep.Timeout = 240;

  return undefined;
});

// 116
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.CYBER, (player) => {
  spawnRandomPickup(player.Position);

  return undefined;
});

// 125
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.HOPELESS,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Keys are hearts
    if (!g.run.babyBool) {
      g.run.babyBool = true;
      useActiveItemTemp(player, CollectibleType.DULL_RAZOR);
      g.run.babyBool = false;
      player.AddKeys(-1);
      return false;
    }

    return undefined;
  },
);

// 132
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.FREAKY, (player) => {
  useActiveItemTemp(player, CollectibleType.CONVERTER);

  return undefined;
});

// 138
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.MOHAWK, (player) => {
  // Bombs are hearts
  if (!g.run.babyBool) {
    g.run.babyBool = true;
    useActiveItemTemp(player, CollectibleType.DULL_RAZOR);
    g.run.babyBool = false;
    player.AddBombs(-1);
    return false;
  }

  return undefined;
});

// 139
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.ROTTEN_MEAT, (player) => {
  player.UseCard(CardType.FOOL);

  return undefined;
});

// 148
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.FAT, (player) => {
  useActiveItemTemp(player, CollectibleType.NECRONOMICON);

  return undefined;
});

// 163
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.HELMET, (_player) => {
  // Invulnerability when standing still.
  if (g.run.babyBool) {
    return false;
  }

  return undefined;
});

// 177
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.ABAN, (player) => {
  const coins = player.GetNumCoins();

  // Sonic-style health
  if (coins === 0) {
    g.run.dealingExtraDamage = true;
    player.Kill();
    g.run.dealingExtraDamage = false;
    return;
  }

  player.AddCoins(-999);
  repeat(coins, () => {
    const randomPosition = Isaac.GetRandomPosition();
    let velocity = player.Position.sub(randomPosition);
    velocity = velocity.Normalized();
    const multiplier = getRandomInt(4, 20);
    velocity = velocity.mul(multiplier);
    const coin = spawnCoin(
      CoinSubType.PENNY,
      player.Position,
      velocity,
      player,
    );

    // Make it fade away.
    coin.Timeout = 160; // 5.3 seconds

    // We also want it to bounce off the player immediately upon spawning.
    const data = coin.GetData();
    data["recovery"] = true;
  });
  sfxManager.Play(SoundEffect.GOLD_HEART);

  return undefined;
});

// 186
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.FADED, (player) => {
  // Random teleport on hit.
  useActiveItemTemp(player, CollectibleType.TELEPORT);

  return undefined;
});

// 200
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.SMALL_FACE, (player) => {
  useActiveItemTemp(player, CollectibleType.MY_LITTLE_UNICORN);

  return undefined;
});

// 204
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.DENTED, (player) => {
  // Spawns a random key on hit.
  const seed = g.run.rng.Next();
  spawnKey(KeySubType.NULL, player.Position, VectorZero, player, seed);

  return undefined;
});

// 210
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.MEATBOY, (player) => {
  useActiveItemTemp(player, CollectibleType.POTATO_PEELER);

  return undefined;
});

// 212
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.CONJOINED, (_player) => {
  openAllDoors();

  return undefined;
});

// 225
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.ZIPPER, (player) => {
  // Extra enemies spawn on hit Find an existing enemy in the room.
  let dupeEnemy: EntityDescription | undefined;
  for (const npc of getNPCs()) {
    if (!npc.IsBoss()) {
      dupeEnemy = {
        type: npc.Type,
        variant: npc.Variant,
        subType: npc.SubType,
      };
      break;
    }
  }

  // There were no non-boss enemies in the room, so default to spawning a portal.
  if (dupeEnemy === undefined) {
    dupeEnemy = {
      type: EntityType.PORTAL,
      variant: 0,
      subType: 0,
    };
  }

  // Spawn a new enemy.
  const position = g.r.FindFreePickupSpawnPosition(player.Position, 1, true);
  spawn(dupeEnemy.type, dupeEnemy.variant, dupeEnemy.subType, position);

  return undefined;
});

// 227
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.BEARD, (player) => {
  useActiveItemTemp(player, CollectibleType.CROOKED_PENNY);

  return undefined;
});

// 251
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.NUCLEAR, (_player) => {
  // Mama Mega effect on hit.
  g.r.MamaMegaExplossion();

  return undefined;
});

// 258
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.ROCKER, (player) => {
  // Spawns a random bomb on hit.
  const seed = g.run.rng.Next();
  spawnPickup(PickupVariant.BOMB, 0, player.Position, VectorZero, player, seed);

  return undefined;
});

// 260
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.COAT, (player) => {
  useActiveItemTemp(player, CollectibleType.DECK_OF_CARDS);

  return undefined;
});

// 276
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.GARGOYLE, (player) => {
  useActiveItemTemp(player, CollectibleType.HEAD_OF_KRAMPUS);

  return undefined;
});

// 285
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.BIG_TONGUE, (player) => {
  useActiveItemTemp(player, CollectibleType.FLUSH);

  return undefined;
});

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

// 408
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.CENSORED, (player) => {
  // All enemies get confused on hit.
  const confusionFrames = 5 * GAME_FRAMES_PER_SECOND;
  for (const npc of getNPCs()) {
    if (npc.IsVulnerableEnemy()) {
      npc.AddConfusion(EntityRef(player), confusionFrames, false);
    }
  }

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
  if (baby.numHits === undefined) {
    error(`The "numHits" attribute was not defined for: ${baby.name}`);
  }

  g.run.babyCounters++;
  if (g.run.babyCounters === baby.numHits) {
    g.run.babyCounters = 0;
    useActiveItemTemp(player, CollectibleType.MEGA_MUSH);
  }

  return undefined;
});

// 441
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.TV, (player) => {
  const baby = getCurrentBabyDescription();
  if (baby.numHits === undefined) {
    error(`The "numHits" attribute was not defined for: ${baby.name}`);
  }

  g.run.babyCounters++;
  if (g.run.babyCounters === baby.numHits) {
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
    // All enemies get freezed on hit.
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
    if (baby.numHits === undefined) {
      error(`The "numHits" attribute was not defined for: ${baby.name}`);
    }

    if (g.run.babyBool) {
      return;
    }

    // Teleport to the boss room after X hits (but only do it once per floor).
    g.run.babyCounters++;
    if (g.run.babyCounters === baby.numHits) {
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
  const seed = g.run.rng.Next();
  spawnCard(rune, player.Position, VectorZero, player, seed);

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

// 522
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.LOST_WHITE, (player) => {
  useActiveItemTemp(player, CollectibleType.ETERNAL_D6);

  return undefined;
});

// 523
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.LOST_BLACK, (player) => {
  useActiveItemTemp(player, CollectibleType.SPINDOWN_DICE);

  return undefined;
});

// 524
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.LOST_BLUE, (player) => {
  useActiveItemTemp(player, CollectibleType.D10);

  return undefined;
});

// 525
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.LOST_GREY, (player) => {
  useActiveItemTemp(player, CollectibleType.D7);

  return undefined;
});

// 529
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.ILLUSION, (player) => {
  spawnSlotHelper(SlotVariant.CRANE_GAME, player.Position, g.run.craneGameRNG);

  return undefined;
});

// 552
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.KOALA, (player) => {
  const baby = getCurrentBabyDescription();
  if (baby.numHits === undefined) {
    error(`The "numHits" attribute was not defined for: ${baby.name}`);
  }

  g.run.babyCounters++;
  if (g.run.babyCounters === baby.numHits) {
    g.run.babyCounters = 0;
    useActiveItemTemp(player, CollectibleType.GENESIS);
  }

  return undefined;
});

// 555
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.KINDA_LOVABLE,
  (player) => {
    spawnCard(CardType.LOVERS, player.Position, VectorZero, player);

    return undefined;
  },
);

// 577
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.SISTER_MAGGY,
  (player) => {
    // Loses last item on 2nd hit (per room).
    g.run.babyCountersRoom++;
    if (g.run.babyCountersRoom === 2) {
      // Take away an item.
      const itemToTakeAway = g.run.passiveCollectibleTypes.pop();
      if (
        itemToTakeAway !== undefined &&
        player.HasCollectible(itemToTakeAway)
      ) {
        player.RemoveCollectible(itemToTakeAway);
        removeCollectibleFromItemTracker(itemToTakeAway);
      }
    }

    return undefined;
  },
);

// 599
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.ESAU_JR, (player) => {
  player.UseCard(CardType.SOUL_JACOB);

  return undefined;
});

// 601
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.SIREN_SHOOTER,
  (player) => {
    // Spawns a pedestal item after 6 hits.
    g.run.babyCounters++;
    if (g.run.babyCounters === 6) {
      g.run.babyCounters = 0;
      const position = g.r.FindFreePickupSpawnPosition(
        player.Position,
        1,
        true,
      );
      mod.spawnCollectible(CollectibleType.NULL, position, g.run.rng);
    }

    return undefined;
  },
);
