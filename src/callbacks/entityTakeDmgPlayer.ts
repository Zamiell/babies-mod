import { ZERO_VECTOR } from "../constants";
import g from "../globals";
import * as misc from "../misc";
import EntityDescription from "../types/EntityDescription";
import { CollectibleTypeCustom } from "../types/enums";

export function main(
  player: EntityPlayer,
  damageAmount: float,
  damageFlags: int,
  damageSource: EntityRef,
  damageCountdownFrames: int,
): boolean | null {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const [babyType, baby, valid] = misc.getCurrentBaby();
  if (!valid) {
    return null;
  }

  if (g.run.dealingExtraDamage) {
    return null;
  }

  // Check to see if the player is supposed to be temporarily invulnerable
  if (
    g.run.invulnerabilityFrame !== 0 &&
    g.run.invulnerabilityFrame >= gameFrameCount
  ) {
    return false;
  }
  if (g.run.invulnerable) {
    return false;
  }

  // Check to see if this baby is immune to explosive damage
  if (
    baby.explosionImmunity &&
    (damageFlags & DamageFlag.DAMAGE_EXPLOSION) !== 0
  ) {
    return false;
  }

  const babyFunc = functionMap.get(babyType);
  if (babyFunc !== undefined) {
    return babyFunc(
      player,
      damageAmount,
      damageFlags,
      damageSource,
      damageCountdownFrames,
    );
  }

  return null;
}

const functionMap = new Map<
  int,
  (
    player: EntityPlayer,
    damageAmount: float,
    damageFlags: int,
    damageSource: EntityRef,
    damageCountdownFrames: int,
  ) => boolean | null
>();

// Host Baby
functionMap.set(
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

    return null;
  },
);

// Lost Baby
functionMap.set(
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
functionMap.set(
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
    return null;
  },
);

// -0- Baby
functionMap.set(
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
functionMap.set(
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
      if (npc !== null && npc.IsVulnerableEnemy()) {
        // This enemy can be damaged
        npc.HitPoints = npc.MaxHitPoints;
      }
    }

    return null;
  },
);

// Yellow Baby
functionMap.set(
  33,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UsePill(PillEffect.PILLEFFECT_LEMON_PARTY, 0);
    return null;
  },
);

// Buddy Baby
functionMap.set(
  41,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Local variables
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

    return null;
  },
);

// Blinding Baby
functionMap.set(
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
      ZERO_VECTOR,
      player,
    );

    return null;
  },
);

// Revenge Baby
functionMap.set(
  50,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Spawns a random heart on hit
    g.run.randomSeed = misc.incrementRNG(g.run.randomSeed);
    math.randomseed(g.run.randomSeed);
    const heartSubType = math.random(1, 11); // From "Heart" to "Bone Heart"
    Isaac.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_HEART,
      heartSubType,
      player.Position,
      ZERO_VECTOR,
      player,
    );

    return null;
  },
);

// Apollyon Baby
functionMap.set(
  56,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseCard(Card.RUNE_BLACK);

    return null;
  },
);

// Goat Baby
functionMap.set(
  62,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Local variables
    const [, baby] = misc.getCurrentBaby();
    if (baby.numHits === undefined) {
      error(`The "numHits" attribute was not defined for ${baby.name}.`);
    }

    // Guaranteed Devil Room + Angel Room after N hits
    g.run.babyCounters += 1;
    if (g.run.babyCounters >= baby.numHits && !g.run.babyBool) {
      g.run.babyBool = true;
      g.sfx.Play(SoundEffect.SOUND_SATAN_GROW, 1, 0, false, 1);
      player.AddCollectible(CollectibleType.COLLECTIBLE_GOAT_HEAD, 0, false);
      misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_GOAT_HEAD);
      player.AddCollectible(CollectibleType.COLLECTIBLE_DUALITY, 0, false);
      misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_DUALITY);
    }

    return null;
  },
);

// Ghoul Baby
functionMap.set(
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

    return null;
  },
);

// Half Head Baby
functionMap.set(
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

    return null;
  },
);

// D Baby
functionMap.set(
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
      ZERO_VECTOR,
      player,
    ).ToEffect();
    if (creep !== null) {
      creep.Scale = 10;
      creep.Timeout = 240;
    }

    return null;
  },
);

// Cyber Baby
functionMap.set(
  116,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    misc.spawnRandomPickup(player.Position);
    return null;
  },
);

// Hopeless Baby
functionMap.set(
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

    return null;
  },
);

// Freaky Baby
functionMap.set(
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

    return null;
  },
);

// Mohawk Baby
functionMap.set(
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

    return null;
  },
);

// Rotten Meat Baby
functionMap.set(
  139,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.UseCard(Card.CARD_FOOL);
    return null;
  },
);

// Fat Baby
functionMap.set(
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

    return null;
  },
);

// Helmet Baby
functionMap.set(
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

    return null;
  },
);

// Aban Baby
functionMap.set(
  177,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Local variables
    const coins = player.GetNumCoins();

    // Sonic-style health
    if (coins === 0) {
      g.run.dealingExtraDamage = true;
      player.Kill();
      g.run.dealingExtraDamage = false;
      return null;
    }

    player.AddCoins(-99);
    for (let i = 1; i <= coins; i++) {
      // Spawn a Penny
      let velocity = player.Position.__sub(Isaac.GetRandomPosition());
      velocity = velocity.Normalized();
      const modifier = math.random(4, 20);
      velocity = velocity.__mul(modifier);
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
    g.sfx.Play(SoundEffect.SOUND_GOLD_HEART, 1, 0, false, 1);

    return null;
  },
);

// Faded Baby
functionMap.set(
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

    return null;
  },
);

// Small Face Baby
functionMap.set(
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

    return null;
  },
);

// Dented Baby
functionMap.set(
  204,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Spawns a random key on hit
    g.run.randomSeed = misc.incrementRNG(g.run.randomSeed);
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_KEY,
      player.Position,
      ZERO_VECTOR,
      player,
      0,
      g.run.randomSeed,
    );

    return null;
  },
);

// MeatBoy Baby
functionMap.set(
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

    return null;
  },
);

// Conjoined Baby
functionMap.set(
  212,
  (
    _player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    misc.openAllDoors();
    return null;
  },
);

// Zipper Baby
functionMap.set(
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
      if (npc !== null && !npc.IsBoss()) {
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
      ZERO_VECTOR,
      null,
    );

    return null;
  },
);

// Beard Baby
functionMap.set(
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

    return null;
  },
);

// Rocker Baby
functionMap.set(
  258,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Spawns a random bomb on hit
    g.run.randomSeed = misc.incrementRNG(g.run.randomSeed);
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_BOMB,
      player.Position,
      ZERO_VECTOR,
      player,
      0,
      g.run.randomSeed,
    );

    return null;
  },
);

// Coat Baby
functionMap.set(
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

    return null;
  },
);

// Hare Baby
functionMap.set(
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

    // Local variables
    const roomIndex = misc.getRoomIndex();
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
      if (gridEntity !== null) {
        const saveState = gridEntity.GetSaveState();
        if (saveState.Type === GridEntityType.GRID_TRAPDOOR) {
          return false;
        }
      }
    }

    // Check to see if there are Big Chests in the room, as those will cause unavoidable damage
    const bigChests = Isaac.FindByType(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_BIGCHEST,
      -1,
      false,
      false,
    );
    if (bigChests.length > 0) {
      return false;
    }

    return null;
  },
);

// Gargoyle Baby
functionMap.set(
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

    return null;
  },
);

// Spiky Demon Baby
functionMap.set(
  277,
  (
    _player,
    _damageAmount,
    damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Play a custom sound effect if we got hit by a mimic
    // There are 21 damage flags
    for (let i = 0; i <= 21; i++) {
      const bit = (damageFlags & (1 << i)) >>> i;

      // Bit 20 is DAMAGE_CHEST
      if (i === 20 && bit === 1) {
        g.sfx.Play(Isaac.GetSoundIdByName("Laugh"), 0.75, 0, false, 1);
        break;
      }
    }

    return null;
  },
);

// Big Tongue Baby
functionMap.set(
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

    return null;
  },
);

// Banshee Baby
functionMap.set(
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

    return null;
  },
);

// X Mouth Baby
functionMap.set(
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

    return null;
  },
);

// Starry Eyed Baby
functionMap.set(
  310,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Stars Card
    Isaac.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_TAROTCARD,
      Card.CARD_STARS,
      player.Position,
      ZERO_VECTOR,
      player,
    );

    return null;
  },
);

// Puzzle Baby
functionMap.set(
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

    return null;
  },
);

// Fireball Baby
functionMap.set(
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

    return null;
  },
);

// Spartan Baby
functionMap.set(
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
      g.run.randomSeed = misc.incrementRNG(g.run.randomSeed);
      const position = g.r.FindFreePickupSpawnPosition(
        player.Position,
        1,
        true,
      );
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        position,
        ZERO_VECTOR,
        null,
        0,
        g.run.randomSeed,
      );
    }

    return null;
  },
);

// Tortoise Baby
functionMap.set(
  330,
  (
    _player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // 0.5x speed + 50% chance to ignore damage
    g.run.randomSeed = misc.incrementRNG(g.run.randomSeed);
    math.randomseed(g.run.randomSeed);
    const avoidChance = math.random(1, 2);
    if (avoidChance === 2) {
      return false;
    }

    return null;
  },
);

// Skinless Baby
functionMap.set(
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

    return null;
  },
);

// Ballerina Baby
functionMap.set(
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

    return null;
  },
);

// Hero Baby
functionMap.set(
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
    return null;
  },
);

// Twotone Baby
functionMap.set(
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

    return null;
  },
);

// Tanooki Baby
functionMap.set(
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

    return null;
  },
);

// Fiery Baby
functionMap.set(
  366,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    player.ShootRedCandle(ZERO_VECTOR);
    return null;
  },
);

// Dark Elf Baby
functionMap.set(
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

    return null;
  },
);

// Fairyman Baby
functionMap.set(
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
    return null;
  },
);

// Censored Baby
functionMap.set(
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
      if (npc !== null && npc.IsVulnerableEnemy()) {
        // Returns true for enemies that can be damaged
        npc.AddConfusion(EntityRef(player), 150, false); // 5 seconds
      }
    }

    return null;
  },
);

// Catsuit Baby
functionMap.set(
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

    return null;
  },
);

// Cup Baby
functionMap.set(
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
    return null;
  },
);

// TV Baby
functionMap.set(
  441,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Local variables
    const [, baby] = misc.getCurrentBaby();
    if (baby.numHits === undefined) {
      error(`The "numHits" attribute was not defined for ${baby.name}.`);
    }

    g.run.babyCounters += 1;
    if (g.run.babyCounters === baby.numHits) {
      g.run.babyCounters = 0;
      player.UseActiveItem(
        CollectibleType.COLLECTIBLE_MEGA_SATANS_BREATH,
        false,
        false,
        false,
        false,
      );
    }

    return null;
  },
);

// Steroids Baby
functionMap.set(
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

    return null;
  },
);

// Rojen Whitefox Baby
functionMap.set(
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

    return null;
  },
);

// Handsome Mr. Frog Baby
functionMap.set(
  456,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Local variables
    const [, baby] = misc.getCurrentBaby();
    if (baby.num === undefined) {
      error(`The "num" attribute was not defined for ${baby.name}.`);
    }

    player.AddBlueFlies(baby.num, player.Position, null);
    return null;
  },
);

// Mufflerscarf Baby
functionMap.set(
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
      if (npc !== null && npc.IsVulnerableEnemy()) {
        // Returns true for enemies that can be damaged
        npc.AddFreeze(EntityRef(player), 150); // 5 seconds
      }
    }

    return null;
  },
);

// Scoreboard Baby
functionMap.set(
  474,
  (
    _player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Local variables
    const gameFrameCount = g.g.GetFrameCount();

    // Death in 1 minute
    if (g.run.babyCounters === 0) {
      g.run.babyCounters = gameFrameCount + 60 * 30;
    }

    return null;
  },
);

// Egg Baby
functionMap.set(
  488,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Random pill effect on hit
    let pillEffect = -1;
    do {
      g.run.randomSeed = misc.incrementRNG(g.run.randomSeed);
      math.randomseed(g.run.randomSeed);
      pillEffect = math.random(0, PillEffect.NUM_PILL_EFFECTS - 1);
    } while (
      // Reroll the pill effect if it is a pill that Racing+ removes
      pillEffect === PillEffect.PILLEFFECT_AMNESIA || // 25
      pillEffect === PillEffect.PILLEFFECT_QUESTIONMARK // 31
    );

    player.UsePill(pillEffect, 0);
    // (the animation will automatically be canceled by the damage)
    return null;
  },
);

// Glittery Peach Baby
functionMap.set(
  493,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Local variables
    const [, baby] = misc.getCurrentBaby();
    if (baby.numHits === undefined) {
      error(`The "numHits" attribute was not defined for ${baby.name}.`);
    }

    if (g.run.babyBool) {
      return null;
    }

    // Teleport to the boss room after X hits
    // (but only do it once per floor)
    g.run.babyCounters += 1;
    if (g.run.babyCounters === baby.numHits) {
      g.run.babyBool = true;
      player.UseCard(Card.CARD_EMPEROR);
    }

    return null;
  },
);

// Lazy Baby
functionMap.set(
  499,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Random card effect on hit
    let cardType = -1;
    do {
      g.run.randomSeed = misc.incrementRNG(g.run.randomSeed);
      math.randomseed(g.run.randomSeed);
      cardType = math.random(1, 54);
    } while (
      // Reroll the effect if it is a rune effect or Suicide
      (cardType >= Card.RUNE_HAGALAZ && cardType <= Card.RUNE_BLACK) ||
      cardType === Card.CARD_SUICIDE_KING
    );

    player.UseCard(cardType);
    return null;
  },
);

// Reaper Baby
functionMap.set(
  506,
  (
    player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Spawns a random rune on hit
    g.run.randomSeed = misc.incrementRNG(g.run.randomSeed);
    math.randomseed(g.run.randomSeed);
    const runeSubType = math.random(Card.RUNE_HAGALAZ, Card.RUNE_BLACK);
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_TAROTCARD,
      player.Position,
      ZERO_VECTOR,
      player,
      runeSubType,
      g.run.randomSeed,
    );

    return null;
  },
);

// Hooligan Baby
functionMap.set(
  514,
  (
    _player,
    _damageAmount,
    _damageFlags,
    _damageSource,
    _damageCountdownFrames,
  ) => {
    // Local variables
    const roomFrameCount = g.r.GetFrameCount();

    // Double enemies
    // Fix the bug where an enemy can sometimes spawn next to where the player spawns
    if (roomFrameCount === 0) {
      return false;
    }

    return null;
  },
);

// Sister Maggy
functionMap.set(
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
        misc.removeItemFromItemTracker(itemToTakeAway);
      }
    }

    return null;
  },
);
