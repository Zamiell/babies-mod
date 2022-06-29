import {
  BombVariant,
  CacheFlag,
  Card,
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
  GAME_FRAMES_PER_SECOND,
  getDoors,
  getEnumValues,
  getNPCs,
  getRandom,
  getRandomArrayElement,
  getRandomCard,
  getRandomEnumValue,
  getRandomInt,
  getRandomRune,
  isSelfDamage,
  openAllDoors,
  removeCollectibleFromItemTracker,
  repeat,
  sfxManager,
  spawn,
  spawnBomb,
  spawnCard,
  spawnCoin,
  spawnCollectible,
  spawnEffect,
  spawnHeart,
  spawnKey,
  spawnPickup,
  useActiveItemTemp,
  VectorZero,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";
import { EntityDescription } from "../types/EntityDescription";
import {
  getCurrentBabyDescription,
  spawnRandomPickup,
  spawnSlotHelper,
} from "../utils";

export const entityTakeDmgPlayerBabyFunctionMap = new Map<
  int,
  (
    player: EntityPlayer,
    damageAmount: float,
    damageFlags: BitFlags<DamageFlag>,
    damageSource: EntityRef,
    damageCountdownFrames: int,
  ) => boolean | undefined
>();

// Host Baby
entityTakeDmgPlayerBabyFunctionMap.set(9, (player) => {
  repeat(10, () => {
    player.AddBlueSpider(player.Position);
  });

  return undefined;
});

// Lost Baby
entityTakeDmgPlayerBabyFunctionMap.set(10, (player) => {
  // Lost-style health
  g.run.dealingExtraDamage = true;
  player.Kill();
  g.run.dealingExtraDamage = false;

  return false;
});

// Wrapped Baby
entityTakeDmgPlayerBabyFunctionMap.set(20, () => {
  // Use Kamikaze on the next 5 frames.
  g.run.babyCounters = 5;

  return undefined;
});

// -0- Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  24,
  () =>
    // Invulnerability
    false,
);

// Cry Baby
entityTakeDmgPlayerBabyFunctionMap.set(32, () => {
  // Enemies are fully healed on hit.
  for (const npc of getNPCs()) {
    if (npc.IsVulnerableEnemy()) {
      npc.HitPoints = npc.MaxHitPoints;
    }
  }

  return undefined;
});

// Yellow Baby
entityTakeDmgPlayerBabyFunctionMap.set(33, (player) => {
  player.UsePill(PillEffect.LEMON_PARTY, PillColor.NULL);

  return undefined;
});

// Buddy Baby
entityTakeDmgPlayerBabyFunctionMap.set(41, (player) => {
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

// Blinding Baby
entityTakeDmgPlayerBabyFunctionMap.set(46, (player) => {
  spawnCard(Card.SUN, player.Position, VectorZero, player);

  return undefined;
});

// Revenge Baby
entityTakeDmgPlayerBabyFunctionMap.set(50, (player) => {
  // Spawns a random heart on hit.
  const heartSubTypes = getEnumValues(HeartSubType);
  const heartSubType = getRandomArrayElement(heartSubTypes, g.run.rng);
  const seed = g.run.rng.Next();
  spawnHeart(heartSubType, player.Position, VectorZero, player, seed);

  return undefined;
});

// Apollyon Baby
entityTakeDmgPlayerBabyFunctionMap.set(56, (player) => {
  player.UseCard(Card.RUNE_BLACK);

  return undefined;
});

// Goat Baby
entityTakeDmgPlayerBabyFunctionMap.set(62, (player) => {
  const baby = getCurrentBabyDescription();
  if (baby.numHits === undefined) {
    error(`The "numHits" attribute was not defined for: ${baby.name}`);
  }

  // Guaranteed Devil Room + Angel Room after N hits.
  g.run.babyCounters += 1;
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

// Ghoul Baby
entityTakeDmgPlayerBabyFunctionMap.set(83, (player) => {
  useActiveItemTemp(player, CollectibleType.BOOK_OF_SECRETS);

  return undefined;
});

// Half Head Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  98,
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

// D Baby
entityTakeDmgPlayerBabyFunctionMap.set(101, (player) => {
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

// Cyber Baby
entityTakeDmgPlayerBabyFunctionMap.set(116, (player) => {
  spawnRandomPickup(player.Position);

  return undefined;
});

// Hopeless Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  125,
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

// Freaky Baby
entityTakeDmgPlayerBabyFunctionMap.set(132, (player) => {
  useActiveItemTemp(player, CollectibleType.CONVERTER);

  return undefined;
});

// Mohawk Baby
entityTakeDmgPlayerBabyFunctionMap.set(138, (player) => {
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

// Rotten Meat Baby
entityTakeDmgPlayerBabyFunctionMap.set(139, (player) => {
  player.UseCard(Card.FOOL);

  return undefined;
});

// Fat Baby
entityTakeDmgPlayerBabyFunctionMap.set(148, (player) => {
  useActiveItemTemp(player, CollectibleType.NECRONOMICON);

  return undefined;
});

// Helmet Baby
entityTakeDmgPlayerBabyFunctionMap.set(163, () => {
  // Invulnerability when standing still.
  if (g.run.babyBool) {
    return false;
  }

  return undefined;
});

// Aban Baby
entityTakeDmgPlayerBabyFunctionMap.set(177, (player) => {
  const coins = player.GetNumCoins();

  // Sonic-style health
  if (coins === 0) {
    g.run.dealingExtraDamage = true;
    player.Kill();
    g.run.dealingExtraDamage = false;
    return;
  }

  player.AddCoins(-99);
  repeat(coins, () => {
    const randomPosition = Isaac.GetRandomPosition();
    let velocity = player.Position.sub(randomPosition);
    velocity = velocity.Normalized();
    const modifier = getRandomInt(4, 20);
    velocity = velocity.mul(modifier);
    const coin = spawnCoin(
      CoinSubType.PENNY,
      player.Position,
      velocity,
      player,
    );
    const data = coin.GetData();
    data["recovery"] = true;
  });
  sfxManager.Play(SoundEffect.GOLD_HEART);

  return undefined;
});

// Faded Baby
entityTakeDmgPlayerBabyFunctionMap.set(186, (player) => {
  // Random teleport on hit.
  useActiveItemTemp(player, CollectibleType.TELEPORT);

  return undefined;
});

// Small Face Baby
entityTakeDmgPlayerBabyFunctionMap.set(200, (player) => {
  useActiveItemTemp(player, CollectibleType.MY_LITTLE_UNICORN);

  return undefined;
});

// Dented Baby
entityTakeDmgPlayerBabyFunctionMap.set(204, (player) => {
  // Spawns a random key on hit.
  const seed = g.run.rng.Next();
  spawnKey(KeySubType.NULL, player.Position, VectorZero, player, seed);

  return undefined;
});

// MeatBoy Baby
entityTakeDmgPlayerBabyFunctionMap.set(210, (player) => {
  useActiveItemTemp(player, CollectibleType.POTATO_PEELER);

  return undefined;
});

// Conjoined Baby
entityTakeDmgPlayerBabyFunctionMap.set(212, () => {
  openAllDoors();

  return undefined;
});

// Zipper Baby
entityTakeDmgPlayerBabyFunctionMap.set(225, (player) => {
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

// Beard Baby
entityTakeDmgPlayerBabyFunctionMap.set(227, (player) => {
  useActiveItemTemp(player, CollectibleType.CROOKED_PENNY);

  return undefined;
});

// Nuclear Baby
entityTakeDmgPlayerBabyFunctionMap.set(251, () => {
  // Mama Mega effect on hit.
  g.r.MamaMegaExplossion();

  return undefined;
});

// Rocker Baby
entityTakeDmgPlayerBabyFunctionMap.set(258, (player) => {
  // Spawns a random bomb on hit.
  const seed = g.run.rng.Next();
  spawnPickup(PickupVariant.BOMB, 0, player.Position, VectorZero, player, seed);

  return undefined;
});

// Coat Baby
entityTakeDmgPlayerBabyFunctionMap.set(260, (player) => {
  useActiveItemTemp(player, CollectibleType.DECK_OF_CARDS);

  return undefined;
});

// Gargoyle Baby
entityTakeDmgPlayerBabyFunctionMap.set(276, (player) => {
  useActiveItemTemp(player, CollectibleType.HEAD_OF_KRAMPUS);

  return undefined;
});

// Big Tongue Baby
entityTakeDmgPlayerBabyFunctionMap.set(285, (player) => {
  useActiveItemTemp(player, CollectibleType.FLUSH);

  return undefined;
});

// Banshee Baby
entityTakeDmgPlayerBabyFunctionMap.set(293, (player) => {
  useActiveItemTemp(player, CollectibleType.CRACK_THE_SKY);

  return undefined;
});

// Bloodied Baby
entityTakeDmgPlayerBabyFunctionMap.set(301, (player) => {
  const roomClear = g.r.IsClear();

  const doorStateMap = new Map<int, DoorState>();
  for (const door of getDoors()) {
    doorStateMap.set(door.TargetRoomIndex, door.State);
  }

  const useFlags = addFlag(UseFlag.NO_ANIMATION, UseFlag.NO_ANNOUNCER_VOICE);
  player.UseCard(Card.SOUL_CAIN, useFlags);

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

// X Mouth Baby
entityTakeDmgPlayerBabyFunctionMap.set(308, (player) => {
  useActiveItemTemp(player, CollectibleType.MOVING_BOX);

  return undefined;
});

// Starry Eyed Baby
entityTakeDmgPlayerBabyFunctionMap.set(310, (player) => {
  spawnCard(Card.STARS, player.Position, VectorZero, player);

  return undefined;
});

// Puzzle Baby
entityTakeDmgPlayerBabyFunctionMap.set(315, (player) => {
  useActiveItemTemp(player, CollectibleType.D6);

  return undefined;
});

// Fireball Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  318,
  (_player, _damageAmount, _damageFlags, damageSource) => {
    // Immunity from fires
    if (damageSource.Type === EntityType.FIREPLACE) {
      return false;
    }

    return undefined;
  },
);

// Tortoise Baby
entityTakeDmgPlayerBabyFunctionMap.set(330, () => {
  // 0.5x speed + 50% chance to ignore damage.
  const avoidChance = getRandom(g.run.rng);
  if (avoidChance <= 0.5) {
    return false;
  }

  return undefined;
});

// Skinless Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  322,
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

// Ballerina Baby
entityTakeDmgPlayerBabyFunctionMap.set(323, (player) => {
  // Summons a Restock Machine after 6 hits.
  g.run.babyCounters += 1;
  if (g.run.babyCounters === 6) {
    g.run.babyCounters = 0;
    useActiveItemTemp(player, CollectibleTypeCustom.CLOCKWORK_ASSEMBLY);
  }

  return undefined;
});

// Hero Baby
entityTakeDmgPlayerBabyFunctionMap.set(336, () => {
  // We want to evaluate the cache, but we can't do it here because the damage is not applied yet,
  // so mark to do it later in the PostUpdate callback.
  g.run.babyBool = true;

  return undefined;
});

// Tanooki Baby
entityTakeDmgPlayerBabyFunctionMap.set(359, (player) => {
  useActiveItemTemp(player, CollectibleType.MR_ME);

  return undefined;
});

// Fiery Baby
entityTakeDmgPlayerBabyFunctionMap.set(366, (player) => {
  player.ShootRedCandle(VectorZero);

  return undefined;
});

// Dark Elf Baby
entityTakeDmgPlayerBabyFunctionMap.set(378, (player) => {
  useActiveItemTemp(player, CollectibleType.BOOK_OF_THE_DEAD);

  return undefined;
});

// Fairyman Baby
entityTakeDmgPlayerBabyFunctionMap.set(385, (player) => {
  g.run.babyCounters += 1;
  player.AddCacheFlags(CacheFlag.DAMAGE);
  player.EvaluateItems();

  return undefined;
});

// Censored Baby
entityTakeDmgPlayerBabyFunctionMap.set(408, (player) => {
  // All enemies get confused on hit.
  const confusionFrames = 5 * GAME_FRAMES_PER_SECOND;
  for (const npc of getNPCs()) {
    if (npc.IsVulnerableEnemy()) {
      npc.AddConfusion(EntityRef(player), confusionFrames, false);
    }
  }

  return undefined;
});

// Catsuit Baby
entityTakeDmgPlayerBabyFunctionMap.set(412, (player) => {
  useActiveItemTemp(player, CollectibleType.GUPPYS_PAW);

  return undefined;
});

// Magic Cat Baby
entityTakeDmgPlayerBabyFunctionMap.set(428, (player) => {
  const bomb = spawnBomb(BombVariant.GIGA, 0, player.Position);
  bomb.Visible = false;
  bomb.SetExplosionCountdown(0);

  return undefined;
});

// Cup Baby
entityTakeDmgPlayerBabyFunctionMap.set(435, (player) => {
  player.UseCard(Card.AGAINST_HUMANITY);
  // (The animation will automatically be canceled by the damage.)

  return undefined;
});

// Big Mouth Baby 2.
entityTakeDmgPlayerBabyFunctionMap.set(438, (player) => {
  const baby = getCurrentBabyDescription();
  if (baby.numHits === undefined) {
    error(`The "numHits" attribute was not defined for: ${baby.name}`);
  }

  g.run.babyCounters += 1;
  if (g.run.babyCounters === baby.numHits) {
    g.run.babyCounters = 0;
    useActiveItemTemp(player, CollectibleType.MEGA_MUSH);
  }

  return undefined;
});

// TV Baby
entityTakeDmgPlayerBabyFunctionMap.set(441, (player) => {
  const baby = getCurrentBabyDescription();
  if (baby.numHits === undefined) {
    error(`The "numHits" attribute was not defined for: ${baby.name}`);
  }

  g.run.babyCounters += 1;
  if (g.run.babyCounters === baby.numHits) {
    g.run.babyCounters = 0;
    useActiveItemTemp(player, CollectibleType.MEGA_BLAST);
  }

  return undefined;
});

// Steroids Baby
entityTakeDmgPlayerBabyFunctionMap.set(444, (player) => {
  // Forget Me Now on 2nd hit (per room).
  g.run.babyCountersRoom += 1;
  if (g.run.babyCountersRoom >= 2) {
    useActiveItemTemp(player, CollectibleType.FORGET_ME_NOW);
  }

  return undefined;
});

// Rojen Whitefox Baby
entityTakeDmgPlayerBabyFunctionMap.set(446, (player) => {
  useActiveItemTemp(player, CollectibleType.BOOK_OF_SHADOWS);

  return undefined;
});

// Handsome Mr. Frog Baby
entityTakeDmgPlayerBabyFunctionMap.set(456, (player) => {
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  player.AddBlueFlies(baby.num, player.Position, undefined);

  return undefined;
});

// 404 Baby
entityTakeDmgPlayerBabyFunctionMap.set(463, (player) => {
  player.AddCoins(-1);
  player.AddBombs(-1);
  player.AddKeys(-1);

  return undefined;
});

// Mufflerscarf Baby
entityTakeDmgPlayerBabyFunctionMap.set(472, (player) => {
  // All enemies get freezed on hit.
  const freezeFrames = 5 * GAME_FRAMES_PER_SECOND;
  for (const npc of getNPCs()) {
    if (npc.IsVulnerableEnemy()) {
      npc.AddFreeze(EntityRef(player), freezeFrames);
    }
  }

  return undefined;
});

// Scoreboard Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  474,
  (
    _player: EntityPlayer,
    _damageAmount: float,
    damageFlags: BitFlags<DamageFlag>,
  ) => {
    const gameFrameCount = g.g.GetFrameCount();

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

// Egg Baby
entityTakeDmgPlayerBabyFunctionMap.set(488, (player) => {
  // Random pill effect on hit.
  const pillEffect = getRandomEnumValue(PillEffect, g.run.rng, [
    PillEffect.AMNESIA, // 25
    PillEffect.QUESTION_MARKS, // 31
  ]);

  player.UsePill(pillEffect, PillColor.NULL);
  // (The animation will automatically be canceled by the damage.)

  return undefined;
});

// Glittery Peach Baby
entityTakeDmgPlayerBabyFunctionMap.set(493, (player) => {
  const baby = getCurrentBabyDescription();
  if (baby.numHits === undefined) {
    error(`The "numHits" attribute was not defined for: ${baby.name}`);
  }

  if (g.run.babyBool) {
    return;
  }

  // Teleport to the boss room after X hits (but only do it once per floor).
  g.run.babyCounters += 1;
  if (g.run.babyCounters === baby.numHits) {
    g.run.babyBool = true;
    player.UseCard(Card.EMPEROR);
  }

  return undefined;
});

// Lazy Baby
entityTakeDmgPlayerBabyFunctionMap.set(499, (player) => {
  // Random card effect on hit.
  const exceptions = [Card.SUICIDE_KING]; // It would be unfair to randomly die
  const card = getRandomCard(g.run.rng, exceptions);
  player.UseCard(card);

  return undefined;
});

// Reaper Baby
entityTakeDmgPlayerBabyFunctionMap.set(506, (player) => {
  // Spawns a random rune on hit.
  const rune = getRandomRune(g.run.rng);
  const seed = g.run.rng.Next();
  spawnCard(rune, player.Position, VectorZero, player, seed);

  return undefined;
});

// Hooligan Baby
entityTakeDmgPlayerBabyFunctionMap.set(514, () => {
  const roomFrameCount = g.r.GetFrameCount();

  // Double enemies. Fix the bug where an enemy can sometimes spawn next to where the player spawns.
  if (roomFrameCount === 0) {
    return false;
  }

  return undefined;
});

// Koala Baby
entityTakeDmgPlayerBabyFunctionMap.set(552, (player) => {
  const baby = getCurrentBabyDescription();
  if (baby.numHits === undefined) {
    error(`The "numHits" attribute was not defined for: ${baby.name}`);
  }

  g.run.babyCounters += 1;
  if (g.run.babyCounters === baby.numHits) {
    g.run.babyCounters = 0;
    useActiveItemTemp(player, CollectibleType.GENESIS);
  }

  return undefined;
});

// Kinda Loveable Baby
entityTakeDmgPlayerBabyFunctionMap.set(555, (player) => {
  spawnCard(Card.LOVERS, player.Position, VectorZero, player);

  return undefined;
});

// Lost White Baby
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.LOST_WHITE, (player) => {
  useActiveItemTemp(player, CollectibleType.ETERNAL_D6);

  return undefined;
});

// Lost Black Baby
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.LOST_BLACK, (player) => {
  useActiveItemTemp(player, CollectibleType.SPINDOWN_DICE);

  return undefined;
});

// Lost Blue Baby
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.LOST_BLUE, (player) => {
  useActiveItemTemp(player, CollectibleType.D10);

  return undefined;
});

// Lost Grey Baby
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.LOST_GREY, (player) => {
  useActiveItemTemp(player, CollectibleType.D7);

  return undefined;
});

// Illusion Baby
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.ILLUSION, (player) => {
  spawnSlotHelper(SlotVariant.CRANE_GAME, player.Position, g.run.craneGameRNG);

  return undefined;
});

// Sister Maggy
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.SISTER_MAGGY,
  (player) => {
    // Loses last item on 2nd hit (per room).
    g.run.babyCountersRoom += 1;
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

// Siren Shooter
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.SIREN_SHOOTER,
  (player) => {
    // Spawns a pedestal item after 6 hits.
    g.run.babyCounters += 1;
    if (g.run.babyCounters === 6) {
      g.run.babyCounters = 0;
      const position = g.r.FindFreePickupSpawnPosition(
        player.Position,
        1,
        true,
      );
      spawnCollectible(CollectibleType.NULL, position, g.run.rng);
    }

    return undefined;
  },
);

// Esau Jr. Baby
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.ESAU_JR, (player) => {
  player.UseCard(Card.SOUL_JACOB);

  return undefined;
});
