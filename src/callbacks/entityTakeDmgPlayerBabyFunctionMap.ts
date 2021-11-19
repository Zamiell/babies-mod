import {
  getRandom,
  getRandomCard,
  getRandomHeartSubType,
  getRandomInt,
  getRandomRune,
  getRoomIndex,
  nextSeed,
  openAllDoors,
  removeCollectibleFromItemTracker,
} from "isaacscript-common";
import g from "../globals";
import { EntityDescription } from "../types/EntityDescription";
import { CollectibleTypeCustom } from "../types/enums";
import { bigChestExists, getCurrentBaby, spawnRandomPickup } from "../util";

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
entityTakeDmgPlayerBabyFunctionMap.set(
  9,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    for (let i = 0; i < 10; i++) {
      player.AddBlueSpider(player.Position);
    }
  },
);

// Lost Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  10,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Lost-style health
    g.run.dealingExtraDamage = true;
    player.Kill();
    g.run.dealingExtraDamage = false;

    return false;
  },
);

// Wrapped Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  20,
  (
    _player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Use Kamikaze on the next 5 frames
    g.run.babyCounters = 5;
  },
);

// -0- Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  24,
  (
    _player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Invulnerability
    return false;
  },
);

// Cry Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  32,
  (
    _player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Enemies are fully healed on hit
    for (const entity of Isaac.GetRoomEntities()) {
      const npc = entity.ToNPC();
      if (npc !== undefined && npc.IsVulnerableEnemy()) {
        // This enemy can be damaged
        npc.HitPoints = npc.MaxHitPoints;
      }
    }
  },
);

// Yellow Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  33,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UsePill(PillEffect.PILLEFFECT_LEMON_PARTY, 0);
  },
);

// Buddy Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  41,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    const maxHearts = player.GetMaxHearts();

    // Removes a heart container on hit
    if (!g.run.babyBool && maxHearts >= 2) {
      player.AddMaxHearts(-2, true);
      g.run.babyBool = true;
      player.UseActiveItem(
        CollectibleType.COLLECTIBLE_DULL_RAZOR,
        false,
        false,
        false,
        false,
      );
      g.run.babyBool = false;
      return false;
    }

    return undefined;
  },
);

// Blinding Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  46,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    Isaac.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_TAROTCARD,
      Card.CARD_SUN,
      player.Position,
      Vector.Zero,
      player,
    );
  },
);

// Revenge Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  50,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
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
  },
);

// Apollyon Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  56,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseCard(Card.RUNE_BLACK);
  },
);

// Goat Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  62,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    const [, baby] = getCurrentBaby();
    if (baby.numHits === undefined) {
      error(`The "numHits" attribute was not defined for ${baby.name}.`);
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
  },
);

// Ghoul Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  83,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_BOOK_OF_SECRETS,
      false,
      false,
      false,
      false,
    );
  },
);

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
entityTakeDmgPlayerBabyFunctionMap.set(
  101,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
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
  },
);

// Cyber Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  116,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    spawnRandomPickup(player.Position);
  },
);

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
      player.UseActiveItem(
        CollectibleType.COLLECTIBLE_DULL_RAZOR,
        false,
        false,
        false,
        false,
      );
      g.run.babyBool = false;
      player.AddKeys(-1);
      return false;
    }

    return undefined;
  },
);

// Freaky Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  132,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_CONVERTER,
      false,
      false,
      false,
      false,
    );
  },
);

// Mohawk Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  138,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Bombs are hearts
    if (!g.run.babyBool) {
      g.run.babyBool = true;
      player.UseActiveItem(
        CollectibleType.COLLECTIBLE_DULL_RAZOR,
        false,
        false,
        false,
        false,
      );
      g.run.babyBool = false;
      player.AddBombs(-1);
      return false;
    }

    return undefined;
  },
);

// Rotten Meat Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  139,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseCard(Card.CARD_FOOL);
  },
);

// Fat Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  148,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_NECRONOMICON,
      false,
      false,
      false,
      false,
    );
  },
);

// Helmet Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  163,
  (
    _player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Invulnerability when standing still
    if (g.run.babyBool) {
      return false;
    }

    return undefined;
  },
);

// Aban Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  177,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
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
  },
);

// Faded Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  186,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Random teleport on hit
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_TELEPORT,
      false,
      false,
      false,
      false,
    );
  },
);

// Small Face Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  200,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_MY_LITTLE_UNICORN,
      false,
      false,
      false,
      false,
    );
  },
);

// Dented Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  204,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
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
  },
);

// MeatBoy Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  210,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_POTATO_PEELER,
      false,
      false,
      false,
      false,
    );
  },
);

// Conjoined Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  212,
  (
    _player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    openAllDoors();
  },
);

// Zipper Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  225,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Extra enemies spawn on hit
    // Find an existing enemy in the room
    let dupeEnemy: EntityDescription | undefined;
    for (const entity of Isaac.GetRoomEntities()) {
      const npc = entity.ToNPC();
      if (npc !== undefined && !npc.IsBoss()) {
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
  },
);

// Beard Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  227,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_CROOKED_PENNY,
      false,
      false,
      false,
      false,
    );
  },
);

// Rocker Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  258,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
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
  },
);

// Coat Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  260,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_DECK_OF_CARDS,
      false,
      false,
      false,
      false,
    );
  },
);

// Hare Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  267,
  (
    _player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Takes damage when standing still
    // In this function, we return false instead of null because the damage is from the seed

    const roomIndex = getRoomIndex();
    const startingRoomIndex = g.l.GetStartingRoomIndex();
    const gridSize = g.r.GetGridSize();

    // This mechanic should not apply in the starting room
    if (roomIndex === startingRoomIndex) {
      return false;
    }

    // Check to see if there are vanilla trapdoors in the room,
    // as those will cause unavoidable damage
    for (let i = 1; i <= gridSize; i++) {
      const gridEntity = g.r.GetGridEntity(i);
      if (gridEntity !== undefined) {
        const saveState = gridEntity.GetSaveState();
        if (saveState.Type === GridEntityType.GRID_TRAPDOOR) {
          return false;
        }
      }
    }

    if (bigChestExists()) {
      return false;
    }

    return undefined;
  },
);

// Gargoyle Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  276,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS,
      false,
      false,
      false,
      false,
    );
  },
);

// Big Tongue Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  285,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_FLUSH,
      false,
      false,
      false,
      false,
    );
  },
);

// Banshee Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  293,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_CRACK_THE_SKY,
      false,
      false,
      false,
      false,
    );
  },
);

// X Mouth Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  308,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_MOVING_BOX,
      false,
      false,
      false,
      false,
    );
  },
);

// Starry Eyed Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  310,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    Isaac.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_TAROTCARD,
      Card.CARD_STARS,
      player.Position,
      Vector.Zero,
      player,
    );
  },
);

// Puzzle Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  315,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_D6,
      false,
      false,
      false,
      false,
    );
  },
);

// Fireball Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  318,
  (
    _player,
    _damageAmount,
    _damageFlags,
    damageSource,
    _damageCountdownFrames,
  ) => {
    // Immunity from fires
    if (damageSource.Type === EntityType.ENTITY_FIREPLACE) {
      return false;
    }

    return undefined;
  },
);

// Spartan Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  329,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
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

// Tortoise Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  330,
  (
    _player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // 0.5x speed + 50% chance to ignore damage
    g.run.randomSeed = nextSeed(g.run.randomSeed);
    const avoidChance = getRandom(g.run.randomSeed);
    if (avoidChance <= 0.5) {
      return false;
    }

    return undefined;
  },
);

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
entityTakeDmgPlayerBabyFunctionMap.set(
  323,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Summons a Restock Machine after 6 hits
    g.run.babyCounters += 1;
    if (g.run.babyCounters === 6) {
      g.run.babyCounters = 0;
      player.UseActiveItem(
        CollectibleTypeCustom.COLLECTIBLE_CLOCKWORK_ASSEMBLY,
        false,
        false,
        false,
        false,
      );
    }
  },
);

// Hero Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  336,
  (
    _player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // We want to evaluate the cache, but we can't do it here because the damage is not applied yet,
    // so mark to do it later in the PostUpdate callback
    g.run.babyBool = true;
  },
);

// Twotone Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  346,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_DATAMINER,
      false,
      false,
      false,
      false,
    );
  },
);

// Tanooki Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  359,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_MR_ME,
      false,
      false,
      false,
      false,
    );
  },
);

// Fiery Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  366,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.ShootRedCandle(Vector.Zero);
  },
);

// Dark Elf Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  378,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_BOOK_OF_THE_DEAD,
      false,
      false,
      false,
      false,
    );
  },
);

// Fairyman Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  385,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    g.run.babyCounters += 1;
    player.AddCacheFlags(CacheFlag.CACHE_DAMAGE);
    player.EvaluateItems();
  },
);

// Censored Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  408,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // All enemies get confused on hit
    for (const entity of Isaac.GetRoomEntities()) {
      const npc = entity.ToNPC();
      if (npc !== undefined && npc.IsVulnerableEnemy()) {
        // Returns true for enemies that can be damaged
        npc.AddConfusion(EntityRef(player), 150, false); // 5 seconds
      }
    }
  },
);

// Catsuit Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  412,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_GUPPYS_PAW,
      false,
      false,
      false,
      false,
    );
  },
);

// Cup Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  435,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseCard(Card.CARD_HUMANITY);
    // (the animation will automatically be canceled by the damage)
  },
);

// TV Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  441,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    const [, baby] = getCurrentBaby();
    if (baby.numHits === undefined) {
      error(`The "numHits" attribute was not defined for ${baby.name}.`);
    }

    g.run.babyCounters += 1;
    if (g.run.babyCounters === baby.numHits) {
      g.run.babyCounters = 0;
      player.UseActiveItem(
        CollectibleType.COLLECTIBLE_MEGA_BLAST,
        false,
        false,
        false,
        false,
      );
    }
  },
);

// Steroids Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  444,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Forget Me Now on 2nd hit (per room)
    g.run.babyCountersRoom += 1;
    if (g.run.babyCountersRoom >= 2) {
      player.UseActiveItem(
        CollectibleType.COLLECTIBLE_FORGET_ME_NOW,
        false,
        false,
        false,
        false,
      );
    }
  },
);

// Rojen Whitefox Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  446,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS,
      false,
      false,
      false,
      false,
    );
  },
);

// Handsome Mr. Frog Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  456,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    const [, baby] = getCurrentBaby();
    if (baby.num === undefined) {
      error(`The "num" attribute was not defined for ${baby.name}.`);
    }

    player.AddBlueFlies(baby.num, player.Position, undefined);
  },
);

// Mufflerscarf Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  472,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // All enemies get freezed on hit
    for (const entity of Isaac.GetRoomEntities()) {
      const npc = entity.ToNPC();
      if (npc !== undefined && npc.IsVulnerableEnemy()) {
        // Returns true for enemies that can be damaged
        npc.AddFreeze(EntityRef(player), 150); // 5 seconds
      }
    }
  },
);

// Scoreboard Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  474,
  (
    _player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    const gameFrameCount = g.g.GetFrameCount();

    // Death in 1 minute
    if (g.run.babyCounters === 0) {
      g.run.babyCounters = gameFrameCount + 60 * 30;
    }
  },
);

// Egg Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  488,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
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
  },
);

// Glittery Peach Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  493,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    const [, baby] = getCurrentBaby();
    if (baby.numHits === undefined) {
      error(`The "numHits" attribute was not defined for ${baby.name}.`);
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
  },
);

// Lazy Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  499,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Random card effect on hit
    let card: Card;
    do {
      g.run.randomSeed = nextSeed(g.run.randomSeed);
      card = getRandomCard(g.run.randomSeed);
    } while (card === Card.CARD_SUICIDE_KING);

    player.UseCard(card);
  },
);

// Reaper Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  506,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
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
  },
);

// Hooligan Baby
entityTakeDmgPlayerBabyFunctionMap.set(
  514,
  (
    _player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    const roomFrameCount = g.r.GetFrameCount();

    // Double enemies
    // Fix the bug where an enemy can sometimes spawn next to where the player spawns
    if (roomFrameCount === 0) {
      return false;
    }

    return undefined;
  },
);

// Sister Maggy
entityTakeDmgPlayerBabyFunctionMap.set(
  523,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Loses last item on 2nd hit (per room)
    g.run.babyCountersRoom += 1;
    if (g.run.babyCountersRoom === 2) {
      // Take away an item
      const itemToTakeAway = g.run.passiveItems.pop();
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
