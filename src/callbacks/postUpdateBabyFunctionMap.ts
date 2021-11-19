import {
  getRoomIndex,
  isActionPressedOnAnyInput,
  nextSeed,
  teleport,
} from "isaacscript-common";
import { TELEPORT_TO_ROOM_TYPE_MAP } from "../constants";
import g from "../globals";
import * as pseudoRoomClear from "../pseudoRoomClear";
import { EffectVariantCustom } from "../types/enums";
import { getCurrentBaby } from "../util";
import * as postRender from "./postRender";

export const postUpdateBabyFunctionMap = new Map<int, () => void>();

// Troll Baby
postUpdateBabyFunctionMap.set(6, () => {
  const gameFrameCount = g.g.GetFrameCount();

  // Every 3 seconds
  if (gameFrameCount % 90 === 0) {
    Isaac.Spawn(
      EntityType.ENTITY_BOMB,
      BombVariant.BOMB_TROLL,
      0,
      g.p.Position,
      Vector.Zero,
      undefined,
    );
  }
});

// Bean Baby
postUpdateBabyFunctionMap.set(17, () => {
  const gameFrameCount = g.g.GetFrameCount();

  // Prevent softlocks that occur if you try to jump into a Big Chest
  const bigChests = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BIGCHEST,
  );
  if (bigChests.length > 0) {
    return;
  }

  // Every 1 second
  if (gameFrameCount % 30 === 0) {
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_BUTTER_BEAN,
      false,
      false,
      false,
      false,
    );
  }
});

// Wrath Baby
postUpdateBabyFunctionMap.set(19, () => {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  if (gameFrameCount % baby.num === 0) {
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_ANARCHIST_COOKBOOK,
      false,
      false,
      false,
      false,
    );
  }
});

// Wrapped Baby
postUpdateBabyFunctionMap.set(20, () => {
  const gameFrameCount = g.g.GetFrameCount();

  // If the explosions happen too fast, it looks buggy, so do it instead every 3 frames
  if (gameFrameCount % 3 === 0 && g.run.babyCounters > 0) {
    // This should not cause any damage since the player will have invulnerability frames
    g.run.babyCounters -= 1;
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_KAMIKAZE,
      false,
      false,
      false,
      false,
    );
  }
});

// Black Baby
postUpdateBabyFunctionMap.set(27, () => {
  pseudoRoomClear.postUpdate();
});

// Lil' Baby
postUpdateBabyFunctionMap.set(36, () => {
  // Everything is tiny
  // This does not work if we put it in the PostNewLevel callback for some reason
  if (g.p.SpriteScale.X > 0.5 || g.p.SpriteScale.Y > 0.5) {
    g.p.SpriteScale = Vector(0.5, 0.5);
  }
});

// Big Baby
postUpdateBabyFunctionMap.set(37, () => {
  // Everything is giant
  // This does not work if we put it in the PostNewLevel callback for some reason
  if (g.p.SpriteScale.X < 2 || g.p.SpriteScale.Y < 2) {
    g.p.SpriteScale = Vector(2, 2);
  }
});

// Noose Baby
postUpdateBabyFunctionMap.set(39, () => {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby] = getCurrentBaby();
  if (baby.time === undefined) {
    error(`The "time" attribute was not defined for ${baby.name}.`);
  }

  // Shooting when the timer reaches 0 causes damage
  const remainingTime = g.run.babyCounters - gameFrameCount;
  if (remainingTime <= 0) {
    g.run.babyCounters = gameFrameCount + baby.time; // Reset the timer

    for (let i = 0; i <= 3; i++) {
      if (
        isActionPressedOnAnyInput(ButtonAction.ACTION_SHOOTLEFT) || // 4
        isActionPressedOnAnyInput(ButtonAction.ACTION_SHOOTRIGHT) || // 5
        isActionPressedOnAnyInput(ButtonAction.ACTION_SHOOTUP) || // 6
        isActionPressedOnAnyInput(ButtonAction.ACTION_SHOOTDOWN) // 7
      ) {
        g.p.TakeDamage(1, 0, EntityRef(g.p), 0);
        return;
      }
    }
  }
});

// Whore Baby
postUpdateBabyFunctionMap.set(43, () => {
  const roomIndex = getRoomIndex();

  // All enemies explode
  // Perform the explosion that was initiated in the PostEntityKill callback
  // We iterate backwards because we need to remove elements from the array
  for (let i = g.run.babyExplosions.length - 1; i >= 0; i--) {
    const explosion = g.run.babyExplosions[i];
    if (explosion.roomIndex === roomIndex) {
      Isaac.Explode(explosion.position, undefined, 50); // 49 deals 1 half heart of damage
      g.run.babyExplosions.splice(i, 1); // Remove this element
    }
  }
});

// Dark Baby
postUpdateBabyFunctionMap.set(48, () => {
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  // Temporary blindness
  // Make the counters tick from 0 --> max --> 0, etc.
  if (!g.run.babyBool) {
    g.run.babyCounters += 1;
    if (g.run.babyCounters === baby.num) {
      g.run.babyBool = true;
    }
  } else {
    g.run.babyCounters -= 1;
    if (g.run.babyCounters === 0) {
      g.run.babyBool = false;
    }
  }
});

// Bound Baby
postUpdateBabyFunctionMap.set(58, () => {
  const gameFrameCount = g.g.GetFrameCount();

  // Every 7 seconds
  if (gameFrameCount % 210 === 0) {
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_MONSTER_MANUAL,
      false,
      false,
      false,
      false,
    );
  }
});

// Butthole Baby
postUpdateBabyFunctionMap.set(63, () => {
  const gameFrameCount = g.g.GetFrameCount();

  // Every 5 seconds
  if (gameFrameCount % 150 === 0) {
    // Spawn a random poop
    g.run.randomSeed = nextSeed(g.run.randomSeed);
    math.randomseed(g.run.randomSeed);
    const poopVariant = math.random(0, 6);
    if (
      poopVariant === PoopGridEntityVariant.RED ||
      poopVariant === PoopGridEntityVariant.CORN
    ) {
      // If the poop is this type, it will instantly damage the player,
      // so give them some invulnerability frames
      g.run.invulnerabilityFrame = gameFrameCount + 25;
    }
    Isaac.GridSpawn(GridEntityType.GRID_POOP, poopVariant, g.p.Position, false);

    // Playing "SoundEffect.SOUND_FART" will randomly play one of the three farting sound effects
    g.sfx.Play(SoundEffect.SOUND_FART);
  }
});

// Eye Patch Baby
postUpdateBabyFunctionMap.set(64, () => {
  Isaac.GridSpawn(GridEntityType.GRID_SPIKES, 0, g.p.Position, false);
});

// Scream Baby
postUpdateBabyFunctionMap.set(81, () => {
  const gameFrameCount = g.g.GetFrameCount();
  const activeCharge = g.p.GetActiveCharge();
  const batteryCharge = g.p.GetBatteryCharge();

  // We store the main charge in the "babyCounters" variable
  // We store the Battery charge in the "babyNPC.type" variable
  if (
    g.run.babyFrame !== 0 &&
    gameFrameCount <= g.run.babyFrame + 1 &&
    (activeCharge !== g.run.babyCounters ||
      batteryCharge !== g.run.babyNPC.type)
  ) {
    g.p.SetActiveCharge(g.run.babyCounters + g.run.babyNPC.type);
    g.sfx.Stop(SoundEffect.SOUND_BATTERYCHARGE);
    g.sfx.Stop(SoundEffect.SOUND_BEEP);
  }
});

// Nerd Baby
postUpdateBabyFunctionMap.set(90, () => {
  pseudoRoomClear.postUpdate();
});

// Frown Baby
postUpdateBabyFunctionMap.set(96, () => {
  const gameFrameCount = g.g.GetFrameCount();

  // Every 5 seconds
  if (gameFrameCount % 150 === 0) {
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_BEST_FRIEND,
      false,
      false,
      false,
      false,
    );
  }
});

// Brownie Baby
postUpdateBabyFunctionMap.set(107, () => {
  // Starts with Level 4 Meatboy + Level 4 Meatgirl
  // (if you spawn them in the PostNewLevel callback, it does not work for some reason)
  if (g.run.babyBool) {
    return;
  }

  g.run.babyBool = true;
  Isaac.Spawn(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.CUBE_OF_MEAT_4, // 47
    0,
    g.p.Position,
    Vector.Zero,
    undefined,
  );
  Isaac.Spawn(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.BALL_OF_BANDAGES_4, // 72
    0,
    g.p.Position,
    Vector.Zero,
    undefined,
  );
});

// Pubic Baby
postUpdateBabyFunctionMap.set(110, () => {
  const rooms = g.l.GetRooms();
  const roomClear = g.r.IsClear();

  // Don't do anything if we already full cleared the floor
  if (g.run.babyBool) {
    return;
  }

  // The doors are not open because the room is not yet cleared
  if (!roomClear) {
    return;
  }

  // Check to see if the floor is full cleared
  let allCleared = true;
  for (let i = 0; i < rooms.Size; i++) {
    const roomDesc = rooms.Get(i); // This is 0-indexed
    if (roomDesc === undefined) {
      continue;
    }
    const roomData = roomDesc.Data;
    if (roomData === undefined) {
      continue;
    }
    const roomType2 = roomData.Type;
    if (
      (roomType2 === RoomType.ROOM_DEFAULT || // 1
        roomType2 === RoomType.ROOM_MINIBOSS) && // 6
      !roomDesc.Clear
    ) {
      allCleared = false;
      break;
    }
  }
  if (allCleared) {
    g.run.babyBool = true;
    return;
  }

  // Keep the boss room door closed
  for (let i = 0; i <= 7; i++) {
    const door = g.r.GetDoor(i);
    if (door !== undefined && door.IsRoomType(RoomType.ROOM_BOSS)) {
      door.Bar();
    }
  }
});

// Eyemouth Baby
postUpdateBabyFunctionMap.set(111, () => {
  const gameFrameCount = g.g.GetFrameCount();

  if (g.run.babyTears.frame !== 0 && gameFrameCount >= g.run.babyTears.frame) {
    g.run.babyTears.frame = 0;
    g.p.FireTear(g.p.Position, g.run.babyTears.velocity, false, true, false);
  }
});

// Hopeless Baby
postUpdateBabyFunctionMap.set(125, () => {
  const keys = g.p.GetNumKeys();

  // Keys are hearts
  if (keys === 0) {
    g.run.dealingExtraDamage = true;
    g.p.Kill();
    g.run.dealingExtraDamage = false;
  }
});

// Earwig Baby
postUpdateBabyFunctionMap.set(128, () => {
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const rooms = g.l.GetRooms();
  const centerPos = g.r.GetCenterPos();
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  // The floor may be reseeded, so we do not want this to be in the PostNewLevel callback
  if (g.run.babyBool) {
    return;
  }
  g.run.babyBool = true;

  // 3 rooms are already explored
  // Get the indexes of every room on the floor
  const floorIndexes: int[] = [];
  for (let i = 0; i < rooms.Size; i++) {
    const room = rooms.Get(i); // This is 0 indexed
    if (room !== undefined) {
      floorIndexes.push(room.SafeGridIndex);
    }
  }

  // Get N unique random indexes
  const randomFloorIndexes: int[] = [];
  for (let i = 1; i <= baby.num; i++) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Get a random room index on the floor
      g.run.randomSeed = nextSeed(g.run.randomSeed);
      math.randomseed(g.run.randomSeed);
      const randomIndex = math.random(0, floorIndexes.length - 1);
      const randomFloorIndex = floorIndexes[randomIndex];

      // Check to see if this is one of the indexes that we are already warping to
      if (randomFloorIndexes.includes(randomFloorIndex)) {
        continue;
      }

      // We don't want the starting room to count
      if (randomFloorIndex === startingRoomIndex) {
        continue;
      }

      // Add it
      randomFloorIndexes.push(randomFloorIndex);
      break;
    }
  }

  // Explore these rooms
  for (const roomIndex of randomFloorIndexes) {
    // You have to set LeaveDoor before every room change or else it will send you to the wrong room
    g.l.LeaveDoor = -1;
    g.l.ChangeRoom(roomIndex);

    // We might have traveled to the Boss Room, so stop the Portcullis sound effect just in case
    g.sfx.Stop(SoundEffect.SOUND_CASTLEPORTCULLIS);
  }

  // You have to set LeaveDoor before every room change or else it will send you to the wrong room
  g.l.LeaveDoor = -1;
  g.l.ChangeRoom(startingRoomIndex);
  g.p.Position = centerPos;
});

// Mohawk Baby
postUpdateBabyFunctionMap.set(138, () => {
  const bombs = g.p.GetNumBombs();

  // Bombs are hearts
  if (bombs === 0) {
    g.run.dealingExtraDamage = true;
    g.p.Kill();
    g.run.dealingExtraDamage = false;
  }
});

// Bluebird Baby
postUpdateBabyFunctionMap.set(147, () => {
  const gameFrameCount = g.g.GetFrameCount();

  if (g.run.babyFrame !== 0 && gameFrameCount >= g.run.babyFrame) {
    g.run.babyFrame = 0;
  }

  // Touching pickups causes paralysis (1/2)
  if (!g.p.IsItemQueueEmpty() && g.run.babyFrame === 0) {
    // Using a pill does not clear the queue,
    // so without a frame check the following code would softlock the player
    g.run.babyFrame = gameFrameCount + 45;
    g.p.UsePill(PillEffect.PILLEFFECT_PARALYSIS, PillColor.PILL_NULL);
  }
});

// Awaken Baby
postUpdateBabyFunctionMap.set(155, () => {
  const gameFrameCount = g.g.GetFrameCount();

  // Every 1 second
  if (gameFrameCount % 30 === 0) {
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_TELEKINESIS,
      false,
      false,
      false,
      false,
    );
  }
});

// Puff Baby
postUpdateBabyFunctionMap.set(156, () => {
  const gameFrameCount = g.g.GetFrameCount();
  const hearts = g.p.GetHearts();
  const soulHearts = g.p.GetSoulHearts();
  const boneHearts = g.p.GetBoneHearts();

  // Prevent softlocks that occur if you try to jump into a Big Chest
  const bigChests = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BIGCHEST,
  );
  if (bigChests.length > 0) {
    return;
  }

  // Prevent dying animation softlocks
  if (hearts + soulHearts + boneHearts === 0) {
    return;
  }

  // Every 5 seconds
  if (gameFrameCount % 150 === 0) {
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_MEGA_BEAN,
      false,
      false,
      false,
      false,
    );
  }
});

// Pretty Baby
postUpdateBabyFunctionMap.set(158, () => {
  const gameFrameCount = g.g.GetFrameCount();

  // Every 5 seconds
  if (gameFrameCount % 150 === 0) {
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_MONSTER_MANUAL,
      false,
      false,
      false,
      false,
    );
    g.sfx.Stop(SoundEffect.SOUND_SATAN_GROW);
  }
});

// Digital Baby
postUpdateBabyFunctionMap.set(162, () => {
  const roomFrameCount = g.r.GetFrameCount();

  if (!g.run.babyBool && roomFrameCount <= 1) {
    g.run.babyBool = true;

    // This baby grants SeedEffect.SEED_OLD_TV
    // However, applying this in the PostNewLevel callback can cause game crashes
    // Instead, we manually apply it in the PostUpdate callback
    g.seeds.AddSeedEffect(SeedEffect.SEED_OLD_TV);
  }
});

// Helmet Baby
postUpdateBabyFunctionMap.set(163, () => {
  // Check to see if they are pressing any movement buttons
  const leftPressed = isActionPressedOnAnyInput(ButtonAction.ACTION_LEFT);
  const rightPressed = isActionPressedOnAnyInput(ButtonAction.ACTION_RIGHT);
  const upPressed = isActionPressedOnAnyInput(ButtonAction.ACTION_UP);
  const downPressed = isActionPressedOnAnyInput(ButtonAction.ACTION_DOWN);

  // Keep track of whether they are moving or not
  // Also, fade the character to indicate that they are invulnerable
  if (
    !g.run.babyBool &&
    !leftPressed &&
    !rightPressed &&
    !upPressed &&
    !downPressed
  ) {
    // They stopped moving
    g.run.babyBool = true;
    const color = g.p.GetColor();
    const fadeAmount = 0.5;
    const newColor = Color(
      color.R,
      color.G,
      color.B,
      fadeAmount,
      color.RO,
      color.GO,
      color.BO,
    );
    g.p.SetColor(newColor, 0, 0, true, true);
  } else if (
    g.run.babyBool &&
    (leftPressed || rightPressed || upPressed || downPressed)
  ) {
    // They started moving
    g.run.babyBool = false;
    const color = g.p.GetColor();
    const fadeAmount = 1;
    const newColor = Color(
      color.R,
      color.G,
      color.B,
      fadeAmount,
      color.RO,
      color.GO,
      color.BO,
    );
    g.p.SetColor(newColor, 0, 0, true, true);
  }
});

// Black Eye Baby
postUpdateBabyFunctionMap.set(164, () => {
  // Starts with Leprosy, +5 damage on Leprosy breaking
  // We use the "babyCounters" variable to track how Leprocy familiars are in the room
  const leprocyChunks = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.LEPROSY,
  );
  if (leprocyChunks.length < g.run.babyCounters) {
    g.run.babyCounters -= 1;

    // We use the "babyFrame" variable to track how many damage ups we have received
    g.run.babyFrame += 1;
    g.p.AddCacheFlags(CacheFlag.CACHE_DAMAGE);
    g.p.EvaluateItems();
  }
});

// Worry Baby
postUpdateBabyFunctionMap.set(167, () => {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  // Touching pickups causes teleportation (2/2)
  // Teleport 2 frames in the future so that we can put an item in the Schoolbag
  if (g.run.babyFrame === 0 && !g.p.IsItemQueueEmpty()) {
    g.run.babyFrame = gameFrameCount + baby.num;
  }

  if (g.run.babyFrame === 0 || gameFrameCount < g.run.babyFrame) {
    return;
  }

  g.run.babyFrame = 0;
  g.p.UseActiveItem(
    CollectibleType.COLLECTIBLE_TELEPORT,
    false,
    false,
    false,
    false,
  );
});

// Gappy Baby
postUpdateBabyFunctionMap.set(171, () => {
  // Broken machines drop pedestal items
  // (there is no PostSlotUpdate callback so we have to do this here)
  const slots = Isaac.FindByType(EntityType.ENTITY_SLOT);
  for (const slot of slots) {
    const sprite = slot.GetSprite();
    const data = slot.GetData();
    if (
      data.destroyed === undefined &&
      (sprite.IsPlaying("Broken") || // Normal machines
        sprite.IsPlaying("Death")) // Restock machines
    ) {
      data.destroyed = true;
      g.run.randomSeed = nextSeed(g.run.randomSeed);
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        slot.Position,
        Vector.Zero,
        undefined,
        0,
        g.run.randomSeed,
      );
    }
  }
});

// Skull Baby
postUpdateBabyFunctionMap.set(211, () => {
  const gameFrameCount = g.g.GetFrameCount();

  // Shockwave bombs
  for (let i = g.run.room.tears.length - 1; i >= 0; i--) {
    const tear = g.run.room.tears[i];

    if ((gameFrameCount - tear.frame) % 2 === 0) {
      const explosion = Isaac.Spawn(
        EntityType.ENTITY_EFFECT,
        EffectVariant.ROCK_EXPLOSION,
        0,
        tear.position,
        Vector.Zero,
        g.p,
      );
      const index = g.r.GetGridIndex(tear.position);
      g.r.DestroyGrid(index, true);
      tear.position = tear.position.add(tear.velocity);
      g.sfx.Play(SoundEffect.SOUND_ROCK_CRUMBLE, 0.5);
      // (if the sound effect plays at full volume, it starts to get annoying)

      // Make the shockwave deal damage to the player
      if (tear.position.Distance(g.p.Position) <= 40) {
        g.p.TakeDamage(1, DamageFlag.DAMAGE_EXPLOSION, EntityRef(explosion), 2);
      }

      // Make the shockwave deal damage to NPCs
      const entities = Isaac.FindInRadius(
        tear.position,
        40,
        EntityPartition.ENEMY,
      );
      for (const entity of entities) {
        const damageAmount = g.p.Damage * 1.5;
        entity.TakeDamage(
          damageAmount,
          DamageFlag.DAMAGE_EXPLOSION,
          EntityRef(explosion),
          2,
        );
      }
    }

    // Stop if it gets to a wall
    if (!g.r.IsPositionInRoom(tear.position, 0)) {
      g.run.room.tears.splice(i, 1);
    }
  }
});

// Fancy Baby
postUpdateBabyFunctionMap.set(216, () => {
  const rooms = g.l.GetRooms();

  const item = g.p.QueuedItem.Item;
  if (item === undefined) {
    return;
  }

  const teleportRoomType = TELEPORT_TO_ROOM_TYPE_MAP.get(item.ID);
  if (teleportRoomType === undefined) {
    return;
  }

  // Find the room index of the intended room
  for (let i = 0; i < rooms.Size; i++) {
    const roomDesc = rooms.Get(i); // This is 0 indexed
    if (roomDesc === undefined) {
      continue;
    }
    const roomIndex = roomDesc.SafeGridIndex; // This is always the top-left index
    const roomData = roomDesc.Data;
    if (roomData === undefined) {
      continue;
    }
    const roomType = roomData.Type;
    if (roomType === teleportRoomType) {
      teleport(roomIndex);
      return;
    }
  }
});

// Drool Baby
postUpdateBabyFunctionMap.set(221, () => {
  const gameFrameCount = g.g.GetFrameCount();
  const roomClear = g.r.IsClear();

  // Starts with Monstro's Tooth (improved)
  if (g.run.babyFrame !== 0 && gameFrameCount >= g.run.babyFrame) {
    if (roomClear) {
      // The room might have been cleared since the initial Monstro's Tooth activation
      // If so, cancel the remaining Monstro's
      g.run.babyCounters = 0;
      g.run.babyFrame = 0;
    } else {
      g.p.UseActiveItem(
        CollectibleType.COLLECTIBLE_MONSTROS_TOOTH,
        false,
        false,
        false,
        false,
      );
    }
  }
});

// Bawl Baby
postUpdateBabyFunctionMap.set(231, () => {
  const gameFrameCount = g.g.GetFrameCount();
  const hearts = g.p.GetHearts();
  const soulHearts = g.p.GetSoulHearts();
  const boneHearts = g.p.GetBoneHearts();

  // Prevent softlocks that occur if you try to jump into a Big Chest
  const bigChests = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BIGCHEST,
  );
  if (bigChests.length > 0) {
    return;
  }

  // Prevent dying animation softlocks
  if (hearts + soulHearts + boneHearts === 0) {
    return;
  }

  // Constant Isaac's Tears effect + blindfolded
  if (gameFrameCount % 3 === 0) {
    g.run.babyBool = true;
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_ISAACS_TEARS,
      false,
      false,
      false,
      false,
    );
    g.run.babyBool = false;
  }
});

// Medusa Baby
postUpdateBabyFunctionMap.set(250, () => {
  const bombs = g.p.GetNumBombs();
  const keys = g.p.GetNumKeys();
  const coins = g.p.GetNumCoins();

  // Coins convert to bombs and keys
  if (bombs === 0 && coins > 0) {
    g.p.AddCoins(-1);
    g.p.AddBombs(1);
  }

  // Re-get the coin count
  const newCoins = g.p.GetNumCoins();

  if (keys === 0 && newCoins > 0) {
    g.p.AddCoins(-1);
    g.p.AddKeys(1);
  }
});

// Cloud Baby
postUpdateBabyFunctionMap.set(256, () => {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  if (gameFrameCount % baby.num === 0) {
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_VENTRICLE_RAZOR,
      false,
      false,
      false,
      false,
    );
  }
});

// Raccoon Baby
postUpdateBabyFunctionMap.set(263, () => {
  const roomFrameCount = g.r.GetFrameCount();
  const isFirstVisit = g.r.IsFirstVisit();

  // Reroll all of the rocks in the room
  // (this does not work if we do it in the PostNewRoom callback)
  // (this does not work if we do it on the 0th frame)
  if (roomFrameCount === 1 && isFirstVisit) {
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_D12,
      false,
      false,
      false,
      false,
    );
  }
});

// Hare Baby
postUpdateBabyFunctionMap.set(267, () => {
  const playerSprite = g.p.GetSprite();
  const hasInvincibility = g.p.HasInvincibility();

  // Takes damage when standing still
  // Prevent the (vanilla) bug where the player will take damage upon jumping into a trapdoor
  if (
    !hasInvincibility &&
    (playerSprite.IsPlaying("Trapdoor") ||
      playerSprite.IsPlaying("Trapdoor2") ||
      playerSprite.IsPlaying("Jump") ||
      playerSprite.IsPlaying("LightTravel"))
  ) {
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_DULL_RAZOR,
      false,
      false,
      false,
      false,
    );
    g.sfx.Stop(SoundEffect.SOUND_ISAAC_HURT_GRUNT);
  }
});

// Porcupine Baby
postUpdateBabyFunctionMap.set(270, () => {
  const gameFrameCount = g.g.GetFrameCount();

  if (gameFrameCount % 150 === 0) {
    // 5 seconds
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_WAIT_WHAT,
      false,
      false,
      false,
      false,
    );
  }
});

// Heart Baby
postUpdateBabyFunctionMap.set(290, () => {
  const gameFrameCount = g.g.GetFrameCount();

  if (gameFrameCount % 150 === 0) {
    // 5 seconds
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_DULL_RAZOR,
      false,
      false,
      false,
      false,
    );
    g.sfx.Stop(SoundEffect.SOUND_ISAAC_HURT_GRUNT);
  }
});

// Rider Baby
postUpdateBabyFunctionMap.set(295, () => {
  const activeItem = g.p.GetActiveItem();

  // Keep the pony fully charged
  if (activeItem === CollectibleType.COLLECTIBLE_PONY && g.p.NeedsCharge()) {
    g.p.FullCharge();
    g.sfx.Stop(SoundEffect.SOUND_BATTERYCHARGE);
  }
});

// Pizza Baby
postUpdateBabyFunctionMap.set(303, () => {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby] = getCurrentBaby();
  if (baby.delay === undefined) {
    error(`The "delay" attribute was not defined for ${baby.name}.`);
  }

  if (g.run.babyFrame !== 0 && gameFrameCount >= g.run.babyFrame) {
    g.run.babyCounters += 1;
    g.run.babyFrame = gameFrameCount + baby.delay;
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_BROWN_NUGGET,
      false,
      false,
      false,
      false,
    );
    if (g.run.babyCounters === 19) {
      // One is already spawned with the initial trigger
      g.run.babyCounters = 0;
      g.run.babyFrame = 0;
    }
  }
});

// Hotdog Baby
postUpdateBabyFunctionMap.set(304, () => {
  const gameFrameCount = g.g.GetFrameCount();
  const hearts = g.p.GetHearts();
  const soulHearts = g.p.GetSoulHearts();
  const boneHearts = g.p.GetBoneHearts();

  // Prevent softlocks that occur if you try to jump into a Big Chest
  const bigChests = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BIGCHEST,
  );
  if (bigChests.length > 0) {
    return;
  }

  // Prevent dying animation softlocks
  if (hearts + soulHearts + boneHearts === 0) {
    return;
  }

  // Constant The Bean effect + flight + explosion immunity + blindfolded
  if (gameFrameCount % 3 === 0) {
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_BEAN,
      false,
      false,
      false,
      false,
    );
  }
});

// Corrupted Baby
postUpdateBabyFunctionMap.set(307, () => {
  // Taking items/pickups causes damage (1/2)
  if (!g.p.IsItemQueueEmpty()) {
    g.p.TakeDamage(1, 0, EntityRef(g.p), 0);
  }
});

// Exploding Baby
postUpdateBabyFunctionMap.set(320, () => {
  const gameFrameCount = g.g.GetFrameCount();

  // Check to see if we need to reset the cooldown
  // (after we used the Kamikaze! effect upon touching an obstacle)
  if (g.run.babyFrame !== 0 && gameFrameCount >= g.run.babyFrame) {
    g.run.babyFrame = 0;
  }
});

// Butterfly Baby 2
postUpdateBabyFunctionMap.set(332, () => {
  // Flight + can walk through walls
  g.p.GridCollisionClass = EntityGridCollisionClass.GRIDCOLL_NONE;
});

// Hero Baby
postUpdateBabyFunctionMap.set(336, () => {
  if (g.run.babyBool) {
    g.run.babyBool = false;
    g.p.AddCacheFlags(CacheFlag.CACHE_DAMAGE); // 1
    g.p.AddCacheFlags(CacheFlag.CACHE_FIREDELAY); // 2
    g.p.EvaluateItems();
  }
});

// Vomit Baby
postUpdateBabyFunctionMap.set(341, () => {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby] = getCurrentBaby();
  if (baby.time === undefined) {
    error(`The "time" attribute was not defined for ${baby.name}.`);
  }

  // Moving when the timer reaches 0 causes damage
  const remainingTime = g.run.babyCounters - gameFrameCount;
  if (remainingTime <= 0) {
    g.run.babyCounters = gameFrameCount + baby.time; // Reset the timer

    const cutoff = 0.2;
    if (
      g.p.Velocity.X > cutoff ||
      g.p.Velocity.X < cutoff * -1 ||
      g.p.Velocity.Y > cutoff ||
      g.p.Velocity.Y < cutoff * -1
    ) {
      g.p.TakeDamage(1, 0, EntityRef(g.p), 0);
    }
  }
});

// Fourtone Baby
postUpdateBabyFunctionMap.set(348, () => {
  const activeItem = g.p.GetActiveItem();

  // Keep the Candle always fully charged
  if (activeItem === CollectibleType.COLLECTIBLE_CANDLE && g.p.NeedsCharge()) {
    g.p.FullCharge();
    g.sfx.Stop(SoundEffect.SOUND_BATTERYCHARGE);
  }
});

// Grayscale Baby
postUpdateBabyFunctionMap.set(349, () => {
  const gameFrameCount = g.g.GetFrameCount();

  if (gameFrameCount % 300 === 0) {
    // 10 seconds
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_DELIRIOUS,
      false,
      false,
      false,
      false,
    );
    postRender.setPlayerSprite();
  }
});

// Rabbit Baby
postUpdateBabyFunctionMap.set(350, () => {
  // Starts with How to Jump; must jump often
  g.p.AddCacheFlags(CacheFlag.CACHE_SPEED);
  g.p.EvaluateItems();
});

// Mouse Baby
postUpdateBabyFunctionMap.set(351, () => {
  pseudoRoomClear.postUpdate();
});

// Pink Princess Baby
postUpdateBabyFunctionMap.set(374, () => {
  const gameFrameCount = g.g.GetFrameCount();

  if (gameFrameCount % 120 === 0) {
    // 4 second
    // Spawn a random stomp
    Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariant.MOM_FOOT_STOMP,
      0,
      Isaac.GetRandomPosition(),
      Vector.Zero,
      undefined,
    );
  }
});

// Blue Pig Baby
postUpdateBabyFunctionMap.set(382, () => {
  const gameFrameCount = g.g.GetFrameCount();

  // Every 5 seconds
  if (gameFrameCount % 150 === 0) {
    // Spawn a Mega Troll Bomb
    Isaac.Spawn(
      EntityType.ENTITY_BOMB,
      BombVariant.BOMB_SUPERTROLL,
      0,
      g.p.Position,
      Vector.Zero,
      undefined,
    );
  }
});

// Imp Baby
postUpdateBabyFunctionMap.set(386, () => {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  // If we rotate the knives on every frame, then it spins too fast
  if (gameFrameCount < g.run.babyFrame) {
    return;
  }

  g.run.babyFrame += baby.num;

  // Rotate through the four directions
  g.run.babyCounters += 1;
  if (g.run.babyCounters >= 8) {
    g.run.babyCounters = 4;
  }
});

// Blue Wrestler Baby
postUpdateBabyFunctionMap.set(388, () => {
  // Enemies spawn projectiles upon death
  for (let i = g.run.room.tears.length - 1; i >= 0; i--) {
    const tear = g.run.room.tears[i];

    let velocity = g.p.Position.sub(tear.position);
    velocity = velocity.Normalized();
    velocity = velocity.mul(12);

    Isaac.Spawn(
      EntityType.ENTITY_PROJECTILE,
      ProjectileVariant.PROJECTILE_NORMAL,
      0,
      tear.position,
      velocity,
      undefined,
    );

    tear.num -= 1;
    if (tear.num === 0) {
      // The dead enemy has shot all of its tears, so we remove the tracking element for it
      g.run.room.tears.splice(i, 1);
    }
  }
});

// Plague Baby
postUpdateBabyFunctionMap.set(396, () => {
  const gameFrameCount = g.g.GetFrameCount();

  // Every 5 frames
  if (gameFrameCount % 5 === 0) {
    // Drip creep
    const creep = Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariant.PLAYER_CREEP_RED,
      0,
      g.p.Position,
      Vector.Zero,
      g.p,
    ).ToEffect();
    if (creep !== undefined) {
      creep.Timeout = 240;
    }
  }
});

// Corgi Baby
postUpdateBabyFunctionMap.set(401, () => {
  const gameFrameCount = g.g.GetFrameCount();

  // Every 1.5 seconds
  if (gameFrameCount % 45 === 0) {
    // Spawn a Fly
    Isaac.Spawn(
      EntityType.ENTITY_FLY,
      0,
      0,
      g.p.Position,
      Vector.Zero,
      undefined,
    );
  }
});

// Magic Cat Baby
postUpdateBabyFunctionMap.set(428, () => {
  const gameFrameCount = g.g.GetFrameCount();

  // Every second
  if (gameFrameCount % 30 === 0) {
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_KIDNEY_BEAN,
      false,
      false,
      false,
      false,
    );
  }
});

// Mutated Fish Baby
postUpdateBabyFunctionMap.set(449, () => {
  const gameFrameCount = g.g.GetFrameCount();

  // Every 7 seconds
  if (gameFrameCount % 210 === 0) {
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_SPRINKLER,
      false,
      false,
      false,
      false,
    );
  }
});

// Voxdog Baby
postUpdateBabyFunctionMap.set(462, () => {
  const gameFrameCount = g.g.GetFrameCount();

  // Shockwave tears
  for (let i = g.run.room.tears.length; i >= 0; i--) {
    const tear = g.run.room.tears[i];

    if ((gameFrameCount - tear.frame) % 2 === 0) {
      const explosion = Isaac.Spawn(
        EntityType.ENTITY_EFFECT,
        EffectVariant.ROCK_EXPLOSION,
        0,
        tear.position,
        Vector.Zero,
        g.p,
      );
      const index = g.r.GetGridIndex(tear.position);
      g.r.DestroyGrid(index, true);
      tear.position = tear.position.add(tear.velocity);
      g.sfx.Play(SoundEffect.SOUND_ROCK_CRUMBLE, 0.5, 0);
      // (if the sound effect plays at full volume, it starts to get annoying)

      // Make the shockwave deal damage to NPCs
      const damage = g.p.Damage * 1.5;
      const entities = Isaac.FindInRadius(
        tear.position,
        40,
        EntityPartition.ENEMY,
      );
      for (const entity of entities) {
        entity.TakeDamage(
          damage,
          DamageFlag.DAMAGE_EXPLOSION,
          EntityRef(explosion),
          2,
        );
      }
    }

    // Stop if it gets to a wall
    if (!g.r.IsPositionInRoom(tear.position, 0)) {
      g.run.room.tears.splice(i, 1);
    }
  }
});

// Scoreboard Baby
postUpdateBabyFunctionMap.set(474, () => {
  const gameFrameCount = g.g.GetFrameCount();

  if (g.run.babyCounters !== 0) {
    const remainingTime = g.run.babyCounters - gameFrameCount;
    if (remainingTime <= 0) {
      g.run.babyCounters = 0;

      g.run.dealingExtraDamage = true;
      g.p.Kill();
      g.run.dealingExtraDamage = false;
    }
  }
});

// Cool Orange Baby
postUpdateBabyFunctionMap.set(485, () => {
  const gameFrameCount = g.g.GetFrameCount();

  if (gameFrameCount % 30 === 0) {
    // 1 second
    // Spawn a random rocket target
    const target = Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariantCustom.FETUS_BOSS_TARGET,
      0,
      Isaac.GetRandomPosition(),
      Vector.Zero,
      undefined,
    );
    const sprite = target.GetSprite();
    sprite.Play("Blink", true);
    // Target behavior and rocket behavior are handled in the PostEffectUpdate callback
  }
});

// Mern Baby
postUpdateBabyFunctionMap.set(500, () => {
  const gameFrameCount = g.g.GetFrameCount();

  if (g.run.babyTears.frame !== 0 && gameFrameCount >= g.run.babyTears.frame) {
    g.run.babyTears.frame = 0;
    g.p.FireTear(g.p.Position, g.run.babyTears.velocity, false, true, false);
  }
});

// Sausage Lover Baby
postUpdateBabyFunctionMap.set(508, () => {
  const gameFrameCount = g.g.GetFrameCount();
  const roomClear = g.r.IsClear();

  // Every 5 seconds
  if (
    gameFrameCount % 150 === 0 &&
    // Monstro will target you if there are no enemies in the room (and this is unavoidable)
    !roomClear
  ) {
    g.p.UseActiveItem(
      CollectibleType.COLLECTIBLE_MONSTROS_TOOTH,
      false,
      false,
      false,
      false,
    );
  }
});

// Baggy Cap Baby
postUpdateBabyFunctionMap.set(519, () => {
  const roomClear = g.r.IsClear();

  // Check all of the doors
  if (roomClear) {
    return;
  }

  // Check to see if a door opened before the room was clear
  for (let i = 0; i <= 7; i++) {
    const door = g.r.GetDoor(i);
    if (door !== undefined && door.IsOpen()) {
      door.Close(true);
    }
  }
});

// Twitchy Baby
postUpdateBabyFunctionMap.set(511, () => {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  if (gameFrameCount >= g.run.babyFrame) {
    g.run.babyFrame += baby.num;
    if (g.run.babyBool) {
      // Tear rate is increasing
      g.run.babyCounters += 1;
      if (g.run.babyCounters === baby.max) {
        g.run.babyBool = false;
      }
    } else {
      // Tear rate is decreasing
      g.run.babyCounters -= 1;
      if (g.run.babyCounters === baby.min) {
        g.run.babyBool = true;
      }
    }

    g.p.AddCacheFlags(CacheFlag.CACHE_FIREDELAY);
    g.p.EvaluateItems();
  }
});

// Invisible Baby
postUpdateBabyFunctionMap.set(541, () => {
  const roomFrameCount = g.r.GetFrameCount();

  if (roomFrameCount === 1) {
    // The sprite is a blank PNG, but we also want to remove the shadow
    // Doing this in the PostNewRoom callback won't work
    // Doing this on frame 0 won't work
    g.p.Visible = false;
  }
});
