import {
  closeDoorFast,
  GAME_FRAMES_PER_SECOND,
  getDoors,
  getNPCs,
  getRandom,
  getRandomCard,
  getRandomHeartSubType,
  getRandomInt,
  getRandomRune,
  isSelfDamage,
  nextSeed,
  openAllDoors,
  removeCollectibleFromItemTracker,
} from "isaacscript-common";
import { RandomBabyType } from "../babies";
import g from "../globals";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";
import { EntityDescription } from "../types/EntityDescription";
import {
  getCurrentBaby,
  spawnRandomPickup,
  spawnSlot,
  useActiveItem,
} from "../util";

export const entityTakeDmgPlayerBabyFunctionMap = new Map<
  int,
  (
    player: EntityPlayer,
    damageAmount: float,
    damageFlags: int,
    damageSource: EntityRef,
    damageCountdownFrames: int,
  ) => boolean | void
>();

// Host Baby
entityTakeDmgPlayerBabyFunctionMap.set(9, (player) => {
  for (let i = 0; i < 10; i++) {
    player.AddBlueSpider(player.Position);
  }
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
  // Use Kamikaze on the next 5 frames
  g.run.babyCounters = 5;
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
  // Enemies are fully healed on hit
  for (const npc of getNPCs()) {
    if (npc.IsVulnerableEnemy()) {
      npc.HitPoints = npc.MaxHitPoints;
    }
  }
});

// Yellow Baby
entityTakeDmgPlayerBabyFunctionMap.set(33, (player) => {
  player.UsePill(PillEffect.PILLEFFECT_LEMON_PARTY, 0);
});

// Buddy Baby
entityTakeDmgPlayerBabyFunctionMap.set(41, (player) => {
  const maxHearts = player.GetMaxHearts();

  // Removes a heart container on hit
  if (!g.run.babyBool && maxHearts >= 2) {
    player.AddMaxHearts(-2, true);
    g.run.babyBool = true;
    useActiveItem(player, CollectibleType.COLLECTIBLE_DULL_RAZOR);
    g.run.babyBool = false;
    return false;
  }

  return undefined;
});

// Blinding Baby
entityTakeDmgPlayerBabyFunctionMap.set(46, (player) => {
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TAROTCARD,
    Card.CARD_SUN,
    player.Position,
    Vector.Zero,
    player,
  );
});

// Revenge Baby
entityTakeDmgPlayerBabyFunctionMap.set(50, (player) => {
  // Spawns a random heart on hit
  g.run.randomSeed = nextSeed(g.run.randomSeed);
  const heartSubType = getRandomHeartSubType(g.run.randomSeed);
  g.g.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_HEART,
    player.Position,
    Vector.Zero,
    player,
    heartSubType,
    g.run.randomSeed,
  );
});

// Apollyon Baby
entityTakeDmgPlayerBabyFunctionMap.set(56, (player) => {
  player.UseCard(Card.RUNE_BLACK);
});

// Goat Baby
entityTakeDmgPlayerBabyFunctionMap.set(62, (player) => {
  const [, baby] = getCurrentBaby();
  if (baby.numHits === undefined) {
    error(`The "numHits" attribute was not defined for: ${baby.name}`);
  }

  // Guaranteed Devil Room + Angel Room after N hits
  g.run.babyCounters += 1;
  if (g.run.babyCounters >= baby.numHits && !g.run.babyBool) {
    g.run.babyBool = true;
    g.sfx.Play(SoundEffect.SOUND_SATAN_GROW);
    player.AddCollectible(CollectibleType.COLLECTIBLE_GOAT_HEAD);
    removeCollectibleFromItemTracker(CollectibleType.COLLECTIBLE_GOAT_HEAD);
    player.AddCollectible(CollectibleType.COLLECTIBLE_DUALITY);
    removeCollectibleFromItemTracker(CollectibleType.COLLECTIBLE_DUALITY);
  }
});

// Ghoul Baby
entityTakeDmgPlayerBabyFunctionMap.set(83, (player) => {
  useActiveItem(player, CollectibleType.COLLECTIBLE_BOOK_OF_SECRETS);
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
        0,
        EntityRef(player),
        damageCountdownFrames,
      );
      g.run.babyBool = false;
    }
  },
);

// D Baby
entityTakeDmgPlayerBabyFunctionMap.set(101, (player) => {
  // Spawns creep on hit (improved)
  const creep = Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariant.PLAYER_CREEP_RED,
    0,
    player.Position,
    Vector.Zero,
    player,
  ).ToEffect();
  if (creep !== undefined) {
    creep.Scale = 10;
    creep.Timeout = 240;
  }
});

// Cyber Baby
entityTakeDmgPlayerBabyFunctionMap.set(116, (player) => {
  spawnRandomPickup(player.Position);
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
      useActiveItem(player, CollectibleType.COLLECTIBLE_DULL_RAZOR);
      g.run.babyBool = false;
      player.AddKeys(-1);
      return false;
    }

    return undefined;
  },
);

// Freaky Baby
entityTakeDmgPlayerBabyFunctionMap.set(132, (player) => {
  useActiveItem(player, CollectibleType.COLLECTIBLE_CONVERTER);
});

// Mohawk Baby
entityTakeDmgPlayerBabyFunctionMap.set(138, (player) => {
  // Bombs are hearts
  if (!g.run.babyBool) {
    g.run.babyBool = true;
    useActiveItem(player, CollectibleType.COLLECTIBLE_DULL_RAZOR);
    g.run.babyBool = false;
    player.AddBombs(-1);
    return false;
  }

  return undefined;
});

// Rotten Meat Baby
entityTakeDmgPlayerBabyFunctionMap.set(139, (player) => {
  player.UseCard(Card.CARD_FOOL);
});

// Fat Baby
entityTakeDmgPlayerBabyFunctionMap.set(148, (player) => {
  useActiveItem(player, CollectibleType.COLLECTIBLE_NECRONOMICON);
});

// Helmet Baby
entityTakeDmgPlayerBabyFunctionMap.set(163, () => {
  // Invulnerability when standing still
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
  for (let i = 1; i <= coins; i++) {
    const randomPosition = Isaac.GetRandomPosition();
    let velocity = player.Position.sub(randomPosition);
    velocity = velocity.Normalized();
    const modifier = getRandomInt(4, 20);
    velocity = velocity.mul(modifier);
    const coin = Isaac.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_COIN,
      CoinSubType.COIN_PENNY,
      player.Position,
      velocity,
      player,
    );
    const data = coin.GetData();
    data.recovery = true;
  }
  g.sfx.Play(SoundEffect.SOUND_GOLD_HEART);
});

// Faded Baby
entityTakeDmgPlayerBabyFunctionMap.set(186, (player) => {
  // Random teleport on hit
  useActiveItem(player, CollectibleType.COLLECTIBLE_TELEPORT);
});

// Small Face Baby
entityTakeDmgPlayerBabyFunctionMap.set(200, (player) => {
  useActiveItem(player, CollectibleType.COLLECTIBLE_MY_LITTLE_UNICORN);
});

// Dented Baby
entityTakeDmgPlayerBabyFunctionMap.set(204, (player) => {
  // Spawns a random key on hit
  g.run.randomSeed = nextSeed(g.run.randomSeed);
  g.g.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_KEY,
    player.Position,
    Vector.Zero,
    player,
    0,
    g.run.randomSeed,
  );
});

// MeatBoy Baby
entityTakeDmgPlayerBabyFunctionMap.set(210, (player) => {
  useActiveItem(player, CollectibleType.COLLECTIBLE_POTATO_PEELER);
});

// Conjoined Baby
entityTakeDmgPlayerBabyFunctionMap.set(212, () => {
  openAllDoors();
});

// Zipper Baby
entityTakeDmgPlayerBabyFunctionMap.set(225, (player) => {
  // Extra enemies spawn on hit
  // Find an existing enemy in the room
  let dupeEnemy: EntityDescription | undefined;
  for (const npc of getNPCs()) {
    if (!npc.IsBoss()) {
      dupeEnemy = {
        type: npc.Type,
        variant: npc.Variant,
      };
      break;
    }
  }

  // There were no non-boss enemies in the room, so default to spawning a portal
  if (dupeEnemy === undefined) {
    dupeEnemy = {
      type: EntityType.ENTITY_PORTAL,
      variant: 0,
    };
  }

  // Spawn a new enemy
  const position = g.r.FindFreePickupSpawnPosition(player.Position, 1, true);
  Isaac.Spawn(
    dupeEnemy.type,
    dupeEnemy.variant,
    0,
    position,
    Vector.Zero,
    undefined,
  );
});

// Beard Baby
entityTakeDmgPlayerBabyFunctionMap.set(227, (player) => {
  useActiveItem(player, CollectibleType.COLLECTIBLE_CROOKED_PENNY);
});

// Rocker Baby
entityTakeDmgPlayerBabyFunctionMap.set(258, (player) => {
  // Spawns a random bomb on hit
  g.run.randomSeed = nextSeed(g.run.randomSeed);
  g.g.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BOMB,
    player.Position,
    Vector.Zero,
    player,
    0,
    g.run.randomSeed,
  );
});

// Coat Baby
entityTakeDmgPlayerBabyFunctionMap.set(260, (player) => {
  useActiveItem(player, CollectibleType.COLLECTIBLE_DECK_OF_CARDS);
});

// Gargoyle Baby
entityTakeDmgPlayerBabyFunctionMap.set(276, (player) => {
  useActiveItem(player, CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS);
});

// Big Tongue Baby
entityTakeDmgPlayerBabyFunctionMap.set(285, (player) => {
  useActiveItem(player, CollectibleType.COLLECTIBLE_FLUSH);
});

// Banshee Baby
entityTakeDmgPlayerBabyFunctionMap.set(293, (player) => {
  useActiveItem(player, CollectibleType.COLLECTIBLE_CRACK_THE_SKY);
});

// Bloodied Baby
entityTakeDmgPlayerBabyFunctionMap.set(301, (player) => {
  const roomClear = g.r.IsClear();

  const doorStateMap = new Map<int, DoorState>();
  for (const door of getDoors()) {
    doorStateMap.set(door.TargetRoomIndex, door.State);
  }

  const useFlags = UseFlag.USE_NOANIM | UseFlag.USE_NOANNOUNCER;
  player.UseCard(Card.CARD_SOUL_CAIN, useFlags);

  if (roomClear) {
    return;
  }

  // Soul of Cain will open all of the doors, but we only want to open the doors to the red rooms
  for (const door of getDoors()) {
    const oldState = doorStateMap.get(door.TargetRoomIndex);
    if (oldState === undefined) {
      continue;
    }

    if (oldState !== door.State) {
      closeDoorFast(door);
    }
  }
});

// X Mouth Baby
entityTakeDmgPlayerBabyFunctionMap.set(308, (player) => {
  useActiveItem(player, CollectibleType.COLLECTIBLE_MOVING_BOX);
});

// Starry Eyed Baby
entityTakeDmgPlayerBabyFunctionMap.set(310, (player) => {
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TAROTCARD,
    Card.CARD_STARS,
    player.Position,
    Vector.Zero,
    player,
  );
});

// Puzzle Baby
entityTakeDmgPlayerBabyFunctionMap.set(315, (player) => {
  useActiveItem(player, CollectibleType.COLLECTIBLE_D6);
});

// Fireball Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  318,
  (_player, _damageAmount, _damageFlags, damageSource) => {
    // Immunity from fires
    if (damageSource.Type === EntityType.ENTITY_FIREPLACE) {
      return false;
    }

    return undefined;
  },
);

// Tortoise Baby
entityTakeDmgPlayerBabyFunctionMap.set(330, () => {
  // 0.5x speed + 50% chance to ignore damage
  g.run.randomSeed = nextSeed(g.run.randomSeed);
  const avoidChance = getRandom(g.run.randomSeed);
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
        0,
        EntityRef(player),
        damageCountdownFrames,
      );
      g.run.babyBool = false;
    }
  },
);

// Ballerina Baby
entityTakeDmgPlayerBabyFunctionMap.set(323, (player) => {
  // Summons a Restock Machine after 6 hits
  g.run.babyCounters += 1;
  if (g.run.babyCounters === 6) {
    g.run.babyCounters = 0;
    useActiveItem(player, CollectibleTypeCustom.COLLECTIBLE_CLOCKWORK_ASSEMBLY);
  }
});

// Hero Baby
entityTakeDmgPlayerBabyFunctionMap.set(336, () => {
  // We want to evaluate the cache, but we can't do it here because the damage is not applied yet,
  // so mark to do it later in the PostUpdate callback
  g.run.babyBool = true;
});

// Tanooki Baby
entityTakeDmgPlayerBabyFunctionMap.set(359, (player) => {
  useActiveItem(player, CollectibleType.COLLECTIBLE_MR_ME);
});

// Fiery Baby
entityTakeDmgPlayerBabyFunctionMap.set(366, (player) => {
  player.ShootRedCandle(Vector.Zero);
});

// Dark Elf Baby
entityTakeDmgPlayerBabyFunctionMap.set(378, (player) => {
  useActiveItem(player, CollectibleType.COLLECTIBLE_BOOK_OF_THE_DEAD);
});

// Fairyman Baby
entityTakeDmgPlayerBabyFunctionMap.set(385, (player) => {
  g.run.babyCounters += 1;
  player.AddCacheFlags(CacheFlag.CACHE_DAMAGE);
  player.EvaluateItems();
});

// Censored Baby
entityTakeDmgPlayerBabyFunctionMap.set(408, (player) => {
  // All enemies get confused on hit
  const confusionFrames = 5 * GAME_FRAMES_PER_SECOND;
  for (const npc of getNPCs()) {
    if (npc.IsVulnerableEnemy()) {
      npc.AddConfusion(EntityRef(player), confusionFrames, false);
    }
  }
});

// Catsuit Baby
entityTakeDmgPlayerBabyFunctionMap.set(412, (player) => {
  useActiveItem(player, CollectibleType.COLLECTIBLE_GUPPYS_PAW);
});

// Cup Baby
entityTakeDmgPlayerBabyFunctionMap.set(435, (player) => {
  player.UseCard(Card.CARD_HUMANITY);
  // (the animation will automatically be canceled by the damage)
});

// TV Baby
entityTakeDmgPlayerBabyFunctionMap.set(441, (player) => {
  const [, baby] = getCurrentBaby();
  if (baby.numHits === undefined) {
    error(`The "numHits" attribute was not defined for: ${baby.name}`);
  }

  g.run.babyCounters += 1;
  if (g.run.babyCounters === baby.numHits) {
    g.run.babyCounters = 0;
    useActiveItem(player, CollectibleType.COLLECTIBLE_MEGA_BLAST);
  }
});

// Steroids Baby
entityTakeDmgPlayerBabyFunctionMap.set(444, (player) => {
  // Forget Me Now on 2nd hit (per room)
  g.run.babyCountersRoom += 1;
  if (g.run.babyCountersRoom >= 2) {
    useActiveItem(player, CollectibleType.COLLECTIBLE_FORGET_ME_NOW);
  }
});

// Rojen Whitefox Baby
entityTakeDmgPlayerBabyFunctionMap.set(446, (player) => {
  useActiveItem(player, CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS);
});

// Handsome Mr. Frog Baby
entityTakeDmgPlayerBabyFunctionMap.set(456, (player) => {
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  player.AddBlueFlies(baby.num, player.Position, undefined);
});

// 404 Baby
entityTakeDmgPlayerBabyFunctionMap.set(463, (player) => {
  player.AddCoins(-1);
  player.AddBombs(-1);
  player.AddKeys(-1);
});

// Mufflerscarf Baby
entityTakeDmgPlayerBabyFunctionMap.set(472, (player) => {
  // All enemies get freezed on hit
  const freezeFrames = 5 * GAME_FRAMES_PER_SECOND;
  for (const npc of getNPCs()) {
    if (npc.IsVulnerableEnemy()) {
      npc.AddFreeze(EntityRef(player), freezeFrames);
    }
  }
});

// Scoreboard Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  474,
  (_player: EntityPlayer, _damageAmount: float, damageFlags: int) => {
    const gameFrameCount = g.g.GetFrameCount();

    if (g.run.babyCounters !== 0) {
      return;
    }

    if (isSelfDamage(damageFlags)) {
      return;
    }

    // Death in 1 minute
    g.run.babyCounters = gameFrameCount + 60 * 30;
  },
);

// Egg Baby
entityTakeDmgPlayerBabyFunctionMap.set(488, (player) => {
  // Random pill effect on hit
  let pillEffect: PillEffect;
  do {
    g.run.randomSeed = nextSeed(g.run.randomSeed);
    pillEffect = getRandomInt(
      0,
      PillEffect.NUM_PILL_EFFECTS - 1,
      g.run.randomSeed,
    );
  } while (
    // Reroll the pill effect if it is a pill that Racing+ removes
    pillEffect === PillEffect.PILLEFFECT_AMNESIA || // 25
    pillEffect === PillEffect.PILLEFFECT_QUESTIONMARK // 31
  );

  player.UsePill(pillEffect, 0);
  // (the animation will automatically be canceled by the damage)
});

// Glittery Peach Baby
entityTakeDmgPlayerBabyFunctionMap.set(493, (player) => {
  const [, baby] = getCurrentBaby();
  if (baby.numHits === undefined) {
    error(`The "numHits" attribute was not defined for: ${baby.name}`);
  }

  if (g.run.babyBool) {
    return;
  }

  // Teleport to the boss room after X hits
  // (but only do it once per floor)
  g.run.babyCounters += 1;
  if (g.run.babyCounters === baby.numHits) {
    g.run.babyBool = true;
    player.UseCard(Card.CARD_EMPEROR);
  }
});

// Lazy Baby
entityTakeDmgPlayerBabyFunctionMap.set(499, (player) => {
  // Random card effect on hit
  const exceptions = [Card.CARD_SUICIDE_KING]; // It would be unfair to randomly die
  const card = getRandomCard(g.run.randomSeed, exceptions);
  player.UseCard(card);
});

// Reaper Baby
entityTakeDmgPlayerBabyFunctionMap.set(506, (player) => {
  // Spawns a random rune on hit
  g.run.randomSeed = nextSeed(g.run.randomSeed);
  const rune = getRandomRune(g.run.randomSeed);
  g.g.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TAROTCARD,
    player.Position,
    Vector.Zero,
    player,
    rune,
    g.run.randomSeed,
  );
});

// Hooligan Baby
entityTakeDmgPlayerBabyFunctionMap.set(514, () => {
  const roomFrameCount = g.r.GetFrameCount();

  // Double enemies
  // Fix the bug where an enemy can sometimes spawn next to where the player spawns
  if (roomFrameCount === 0) {
    return false;
  }

  return undefined;
});

// Koala Baby
entityTakeDmgPlayerBabyFunctionMap.set(552, (player) => {
  const [, baby] = getCurrentBaby();
  if (baby.numHits === undefined) {
    error(`The "numHits" attribute was not defined for: ${baby.name}`);
  }

  g.run.babyCounters += 1;
  if (g.run.babyCounters === baby.numHits) {
    g.run.babyCounters = 0;
    useActiveItem(player, CollectibleType.COLLECTIBLE_GENESIS);
  }
});

// Kinda Loveable Baby
entityTakeDmgPlayerBabyFunctionMap.set(555, (player) => {
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TAROTCARD,
    Card.CARD_LOVERS,
    player.Position,
    Vector.Zero,
    player,
  );
});

// Lost White Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.LOST_WHITE_BABY,
  (player) => {
    useActiveItem(player, CollectibleType.COLLECTIBLE_ETERNAL_D6);
  },
);

// Lost Black Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.LOST_BLACK_BABY,
  (player) => {
    useActiveItem(player, CollectibleType.COLLECTIBLE_SPINDOWN_DICE);
  },
);

// Lost Blue Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.LOST_BLUE_BABY,
  (player) => {
    useActiveItem(player, CollectibleType.COLLECTIBLE_D12);
  },
);

// Lost Grey Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.LOST_GREY_BABY,
  (player) => {
    useActiveItem(player, CollectibleType.COLLECTIBLE_D7);
  },
);

// Illusion Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.ILLUSION_BABY,
  (player) => {
    // Spawns a Crane Game on hit
    g.run.craneGameSeed = nextSeed(g.run.craneGameSeed);
    spawnSlot(SlotVariant.CRANE_GAME, player.Position, g.run.craneGameSeed);
  },
);

// Sister Maggy
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.SISTER_MAGGY,
  (player) => {
    // Loses last item on 2nd hit (per room)
    g.run.babyCountersRoom += 1;
    if (g.run.babyCountersRoom === 2) {
      // Take away an item
      const itemToTakeAway = g.run.passiveCollectibles.pop();
      if (
        itemToTakeAway !== undefined &&
        player.HasCollectible(itemToTakeAway)
      ) {
        player.RemoveCollectible(itemToTakeAway);
        removeCollectibleFromItemTracker(itemToTakeAway);
      }
    }
  },
);

// Siren Shooter
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.SIREN_SHOOTER,
  (player) => {
    // Spawns a pedestal item after 6 hits
    g.run.babyCounters += 1;
    if (g.run.babyCounters === 6) {
      g.run.babyCounters = 0;
      g.run.randomSeed = nextSeed(g.run.randomSeed);
      const position = g.r.FindFreePickupSpawnPosition(
        player.Position,
        1,
        true,
      );
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        position,
        Vector.Zero,
        undefined,
        0,
        g.run.randomSeed,
      );
    }
  },
);
