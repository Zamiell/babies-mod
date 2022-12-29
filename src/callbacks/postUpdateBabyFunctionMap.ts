import {
  BombVariant,
  ButtonAction,
  CacheFlag,
  CollectibleType,
  DamageFlag,
  DamageFlagZero,
  Dimension,
  EffectVariant,
  EntityGridCollisionClass,
  EntityPartition,
  EntityType,
  FamiliarVariant,
  GridEntityType,
  PillColor,
  PillEffect,
  PoopGridEntityVariant,
  ProjectileVariant,
  RoomType,
  SeedEffect,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  changeRoom,
  ColorDefault,
  copyColor,
  DISTANCE_OF_GRID_TILE,
  game,
  GAME_FRAMES_PER_SECOND,
  getAllRoomGridIndexes,
  getDimension,
  getDoors,
  getFamiliars,
  getRandomArrayElement,
  getRandomInt,
  getRoomListIndex,
  inStartingRoom,
  isActionPressedOnAnyInput,
  isAllRoomsClear,
  isEntityMoving,
  isShootActionPressedOnAnyInput,
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
import * as pseudoRoomClear from "../pseudoRoomClear";
import { EffectVariantCustom } from "../types/EffectVariantCustom";
import { bigChestExists } from "../utils";
import { getCurrentBabyDescription } from "../utilsBaby";

export const postUpdateBabyFunctionMap = new Map<RandomBabyType, () => void>();

// 31
postUpdateBabyFunctionMap.set(RandomBabyType.RAGE, () => {
  // Infinite bombs
  g.p.AddBombs(1);
});

// 36
postUpdateBabyFunctionMap.set(RandomBabyType.LIL, () => {
  // Everything is tiny. This does not work if we put it in the `POST_NEW_LEVEL` callback for some
  // reason.
  if (g.p.SpriteScale.X > 0.5 || g.p.SpriteScale.Y > 0.5) {
    g.p.SpriteScale = Vector(0.5, 0.5);
  }
});

// 37
postUpdateBabyFunctionMap.set(RandomBabyType.BIG, () => {
  // Everything is giant. This does not work if we put it in the `POST_NEW_LEVEL` callback for some
  // reason.
  if (g.p.SpriteScale.X < 2 || g.p.SpriteScale.Y < 2) {
    g.p.SpriteScale = Vector(2, 2);
  }
});

// 39
postUpdateBabyFunctionMap.set(RandomBabyType.NOOSE, () => {
  const gameFrameCount = game.GetFrameCount();
  const baby = getCurrentBabyDescription();
  if (baby.time === undefined) {
    error(`The "time" attribute was not defined for: ${baby.name}`);
  }

  // Shooting when the timer reaches 0 causes damage.
  const remainingTime = g.run.babyCounters - gameFrameCount;
  if (remainingTime > 0) {
    return;
  }

  g.run.babyCounters = gameFrameCount + baby.time; // Reset the timer
  if (isShootActionPressedOnAnyInput()) {
    g.p.TakeDamage(1, DamageFlagZero, EntityRef(g.p), 0);
  }
});

// 43
postUpdateBabyFunctionMap.set(RandomBabyType.WHORE, () => {
  const roomListIndex = getRoomListIndex();

  // All enemies explode. Perform the explosion that was initiated in the `POST_ENTITY_KILL`
  // callback. We iterate backwards because we need to remove elements from the array.
  for (let i = g.run.babyExplosions.length - 1; i >= 0; i--) {
    const explosion = g.run.babyExplosions[i];
    if (explosion === undefined) {
      error(`Failed to get explosion number: ${i}`);
    }

    if (explosion.roomListIndex === roomListIndex) {
      Isaac.Explode(explosion.position, undefined, 50); // 49 deals 1 half heart of damage
      g.run.babyExplosions.splice(i, 1); // Remove this element
    }
  }
});

// 48
postUpdateBabyFunctionMap.set(RandomBabyType.DARK, () => {
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  // Temporary blindness Make the counters tick from 0 --> max --> 0, etc.
  if (!g.run.babyBool) {
    g.run.babyCounters++;
    if (g.run.babyCounters === baby.num) {
      g.run.babyBool = true;
    }
  } else {
    g.run.babyCounters--;
    if (g.run.babyCounters === 0) {
      g.run.babyBool = false;
    }
  }
});

// 58
postUpdateBabyFunctionMap.set(RandomBabyType.BOUND, () => {
  const gameFrameCount = game.GetFrameCount();

  if (gameFrameCount % (7 * GAME_FRAMES_PER_SECOND) === 0) {
    useActiveItemTemp(g.p, CollectibleType.MONSTER_MANUAL);
    sfxManager.Stop(SoundEffect.SATAN_GROW);
  }
});

// 63
postUpdateBabyFunctionMap.set(RandomBabyType.BUTTHOLE, () => {
  const gameFrameCount = game.GetFrameCount();

  if (gameFrameCount % (5 * GAME_FRAMES_PER_SECOND) === 0) {
    // Spawn a random poop.
    const poopVariant = getRandomInt(
      PoopGridEntityVariant.NORMAL,
      PoopGridEntityVariant.WHITE,
      g.run.rng,
    ) as PoopGridEntityVariant;

    if (
      poopVariant === PoopGridEntityVariant.RED ||
      poopVariant === PoopGridEntityVariant.CORN
    ) {
      // If the poop is this type, it will instantly damage the player, so give them some
      // invulnerability frames.
      g.run.invulnerabilityUntilFrame = gameFrameCount + 25;
    }

    Isaac.GridSpawn(GridEntityType.POOP, poopVariant, g.p.Position);

    sfxManager.Play(SoundEffect.FART);
  }
});

// 64
postUpdateBabyFunctionMap.set(RandomBabyType.EYE_PATCH, () => {
  Isaac.GridSpawn(GridEntityType.SPIKES, 0, g.p.Position);
});

// 81
postUpdateBabyFunctionMap.set(RandomBabyType.SCREAM, () => {
  const gameFrameCount = game.GetFrameCount();
  const activeCharge = g.p.GetActiveCharge();
  const batteryCharge = g.p.GetBatteryCharge();

  // - We store the main charge in the "babyCounters" variable.
  // - We store the Battery charge in the "babyNPC.type" variable.
  if (
    g.run.babyFrame !== 0 &&
    gameFrameCount <= g.run.babyFrame + 1 &&
    (activeCharge !== g.run.babyCounters ||
      batteryCharge !== (g.run.babyNPC.entityType as int))
  ) {
    g.p.SetActiveCharge(g.run.babyCounters + (g.run.babyNPC.entityType as int));
    sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
    sfxManager.Stop(SoundEffect.BEEP);
  }
});

// 90
postUpdateBabyFunctionMap.set(RandomBabyType.NERD, () => {
  pseudoRoomClear.postUpdate(RandomBabyType.NERD);
});

// 96
postUpdateBabyFunctionMap.set(RandomBabyType.FROWN, () => {
  const gameFrameCount = game.GetFrameCount();

  if (gameFrameCount % (5 * GAME_FRAMES_PER_SECOND) === 0) {
    useActiveItemTemp(g.p, CollectibleType.BEST_FRIEND);
  }
});

// 110
postUpdateBabyFunctionMap.set(RandomBabyType.PUBIC, () => {
  const roomClear = g.r.IsClear();
  const dimension = getDimension();

  // Don't do anything if we already full cleared the floor.
  if (g.run.babyBool) {
    return;
  }

  // The doors are not open because the room is not yet cleared.
  if (!roomClear) {
    return;
  }

  // Don't do anything if we are in an alternate dimension.
  if (dimension !== Dimension.MAIN) {
    return;
  }

  const onlyCheckRoomTypes = [RoomType.DEFAULT, RoomType.MINI_BOSS];
  if (isAllRoomsClear(onlyCheckRoomTypes)) {
    g.run.babyBool = true;
    return;
  }

  // Keep the boss room door closed.
  for (const door of getDoors()) {
    if (door.IsRoomType(RoomType.BOSS)) {
      door.Bar();
    }
  }
});

// 111
postUpdateBabyFunctionMap.set(RandomBabyType.EYEMOUTH, () => {
  const gameFrameCount = game.GetFrameCount();

  if (g.run.babyTears.frame !== 0 && gameFrameCount >= g.run.babyTears.frame) {
    g.run.babyTears.frame = 0;
    g.p.FireTear(g.p.Position, g.run.babyTears.velocity, false, true, false);
  }
});

// 125
postUpdateBabyFunctionMap.set(RandomBabyType.HOPELESS, () => {
  const keys = g.p.GetNumKeys();

  // Keys are hearts
  if (keys === 0) {
    g.run.dealingExtraDamage = true;
    g.p.Kill();
    g.run.dealingExtraDamage = false;
  }
});

// 128
postUpdateBabyFunctionMap.set(RandomBabyType.EARWIG, () => {
  // 3 rooms are already explored.
  const startingRoomGridIndex = g.l.GetStartingRoomIndex();
  const centerPos = g.r.GetCenterPos();
  const allRoomGridIndexes = getAllRoomGridIndexes();
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  // Get N unique random indexes.
  const randomFloorGridIndexes: int[] = [];
  do {
    // Get a random room index on the floor.
    const randomFloorGridIndex = getRandomArrayElement(
      allRoomGridIndexes,
      g.run.rng,
    );

    // Check to see if this is one of the indexes that we are already warping to.
    if (randomFloorGridIndexes.includes(randomFloorGridIndex)) {
      continue;
    }

    // We don't want the starting room to count.
    if (randomFloorGridIndex === startingRoomGridIndex) {
      continue;
    }

    randomFloorGridIndexes.push(randomFloorGridIndex);
  } while (randomFloorGridIndexes.length < baby.num);

  // Explore these rooms
  for (const roomGridIndex of randomFloorGridIndexes) {
    changeRoom(roomGridIndex);

    // We might have traveled to the Boss Room, so stop the Portcullis sound effect just in case.
    sfxManager.Stop(SoundEffect.CASTLE_PORTCULLIS);
  }

  changeRoom(startingRoomGridIndex);
  g.p.Position = centerPos;
});

// 138
postUpdateBabyFunctionMap.set(RandomBabyType.MOHAWK, () => {
  const bombs = g.p.GetNumBombs();

  // Bombs are hearts
  if (bombs === 0) {
    g.run.dealingExtraDamage = true;
    g.p.Kill();
    g.run.dealingExtraDamage = false;
  }
});

// 147
postUpdateBabyFunctionMap.set(RandomBabyType.BLUEBIRD, () => {
  const gameFrameCount = game.GetFrameCount();

  if (g.run.babyFrame !== 0 && gameFrameCount >= g.run.babyFrame) {
    g.run.babyFrame = 0;
  }

  // Touching pickups causes paralysis (1/2).
  if (!g.p.IsItemQueueEmpty() && g.run.babyFrame === 0) {
    // Using a pill does not clear the queue, so without a frame check the following code would
    // softlock the player.
    g.run.babyFrame = gameFrameCount + 45;
    g.p.UsePill(PillEffect.PARALYSIS, PillColor.NULL);
  }
});

// 155
postUpdateBabyFunctionMap.set(RandomBabyType.AWAKEN, () => {
  const gameFrameCount = game.GetFrameCount();

  if (gameFrameCount % GAME_FRAMES_PER_SECOND === 0) {
    useActiveItemTemp(g.p, CollectibleType.TELEKINESIS);
  }
});

// 156
postUpdateBabyFunctionMap.set(RandomBabyType.PUFF, () => {
  const gameFrameCount = game.GetFrameCount();
  const hearts = g.p.GetHearts();
  const soulHearts = g.p.GetSoulHearts();
  const boneHearts = g.p.GetBoneHearts();

  if (bigChestExists()) {
    return;
  }

  // Prevent dying animation softlocks.
  if (hearts + soulHearts + boneHearts === 0) {
    return;
  }

  if (gameFrameCount % (5 * GAME_FRAMES_PER_SECOND) === 0) {
    useActiveItemTemp(g.p, CollectibleType.MEGA_BEAN);
  }
});

// 162
postUpdateBabyFunctionMap.set(RandomBabyType.DIGITAL, () => {
  const roomFrameCount = g.r.GetFrameCount();

  if (!g.run.babyBool && roomFrameCount <= 1) {
    g.run.babyBool = true;

    // This baby grants SeedEffect.OLD_TV. However, applying this in the `POST_NEW_LEVEL` callback
    // can cause game crashes. Instead, we manually apply it in the `POST_UPDATE` callback.
    g.seeds.AddSeedEffect(SeedEffect.OLD_TV);
  }
});

// 163
postUpdateBabyFunctionMap.set(RandomBabyType.HELMET, () => {
  // Check to see if they are pressing any movement buttons.
  const leftPressed = isActionPressedOnAnyInput(ButtonAction.LEFT);
  const rightPressed = isActionPressedOnAnyInput(ButtonAction.RIGHT);
  const upPressed = isActionPressedOnAnyInput(ButtonAction.UP);
  const downPressed = isActionPressedOnAnyInput(ButtonAction.DOWN);

  // Keep track of whether they are moving or not Also, fade the character to indicate that they are
  // invulnerable.
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
    const newColor = copyColor(color);
    newColor.A = fadeAmount;
    g.p.SetColor(newColor, 0, 0, true, true);
  } else if (
    g.run.babyBool &&
    (leftPressed || rightPressed || upPressed || downPressed)
  ) {
    // They started moving
    g.run.babyBool = false;
    const color = g.p.GetColor();
    const fadeAmount = 1;
    const newColor = copyColor(color);
    newColor.A = fadeAmount;
    g.p.SetColor(newColor, 0, 0, true, true);
  }
});

// 164
postUpdateBabyFunctionMap.set(RandomBabyType.BLACK_EYE, () => {
  // Starts with Leprosy, +5 damage on Leprosy breaking. We use the "babyCounters" variable to track
  // how Leprocy familiars are in the room.
  const leprocyChunks = getFamiliars(FamiliarVariant.LEPROSY);
  if (leprocyChunks.length < g.run.babyCounters) {
    g.run.babyCounters--;

    // We use the "babyFrame" variable to track how many damage ups we have received.
    g.run.babyFrame++;
    g.p.AddCacheFlags(CacheFlag.DAMAGE);
    g.p.EvaluateItems();
  }
});

// 167
postUpdateBabyFunctionMap.set(RandomBabyType.WORRY, () => {
  const gameFrameCount = game.GetFrameCount();
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  // Touching pickups causes teleportation (2/2). Teleport 2 frames in the future so that we can put
  // an item in the Schoolbag.
  if (g.run.babyFrame === 0 && !g.p.IsItemQueueEmpty()) {
    g.run.babyFrame = gameFrameCount + baby.num;
  }

  if (g.run.babyFrame === 0 || gameFrameCount < g.run.babyFrame) {
    return;
  }

  g.run.babyFrame = 0;
  useActiveItemTemp(g.p, CollectibleType.TELEPORT);
});

// 211
postUpdateBabyFunctionMap.set(RandomBabyType.SKULL, () => {
  const gameFrameCount = game.GetFrameCount();

  // Shockwave bombs
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

      // If the sound effect plays at full volume, it starts to get annoying.
      const volume = 0.5;
      sfxManager.Play(SoundEffect.ROCK_CRUMBLE, volume);

      // Make the shockwave deal damage to the player.
      if (tear.position.Distance(g.p.Position) <= 40) {
        g.p.TakeDamage(1, DamageFlag.EXPLOSION, EntityRef(explosion), 2);
      }

      // Make the shockwave deal damage to NPCs.
      const entities = Isaac.FindInRadius(
        tear.position,
        DISTANCE_OF_GRID_TILE,
        EntityPartition.ENEMY,
      );
      for (const entity of entities) {
        const damageAmount = g.p.Damage * 1.5;
        entity.TakeDamage(
          damageAmount,
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

// 221
postUpdateBabyFunctionMap.set(RandomBabyType.DROOL, () => {
  const gameFrameCount = game.GetFrameCount();
  const roomClear = g.r.IsClear();

  // Starts with Monstro's Tooth (improved).
  if (g.run.babyFrame !== 0 && gameFrameCount >= g.run.babyFrame) {
    if (roomClear) {
      // The room might have been cleared since the initial Monstro's Tooth activation If so, cancel
      // the remaining Monstro's.
      g.run.babyCounters = 0;
      g.run.babyFrame = 0;
    } else {
      useActiveItemTemp(g.p, CollectibleType.MONSTROS_TOOTH);
    }
  }
});

// 231
postUpdateBabyFunctionMap.set(RandomBabyType.BAWL, () => {
  const gameFrameCount = game.GetFrameCount();
  const hearts = g.p.GetHearts();
  const soulHearts = g.p.GetSoulHearts();
  const boneHearts = g.p.GetBoneHearts();

  if (bigChestExists()) {
    return;
  }

  // Prevent dying animation softlocks.
  if (hearts + soulHearts + boneHearts === 0) {
    return;
  }

  // Constant Isaac's Tears effect + blindfolded.
  if (gameFrameCount % 3 === 0) {
    g.run.babyBool = true;
    useActiveItemTemp(g.p, CollectibleType.ISAACS_TEARS);
    g.run.babyBool = false;
  }
});

// 250
postUpdateBabyFunctionMap.set(RandomBabyType.MEDUSA, () => {
  const bombs = g.p.GetNumBombs();
  const keys = g.p.GetNumKeys();
  const coins = g.p.GetNumCoins();

  // Coins convert to bombs and keys.
  if (bombs === 0 && coins > 0) {
    g.p.AddCoins(-1);
    g.p.AddBombs(1);
  }

  // Re-get the coin count.
  const newCoins = g.p.GetNumCoins();

  if (keys === 0 && newCoins > 0) {
    g.p.AddCoins(-1);
    g.p.AddKeys(1);
  }
});

// 256
postUpdateBabyFunctionMap.set(RandomBabyType.CLOUD, () => {
  const gameFrameCount = game.GetFrameCount();
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  if (gameFrameCount % baby.num === 0) {
    useActiveItemTemp(g.p, CollectibleType.VENTRICLE_RAZOR);
  }
});

// 263
postUpdateBabyFunctionMap.set(RandomBabyType.RACCOON, () => {
  const roomFrameCount = g.r.GetFrameCount();
  const isFirstVisit = g.r.IsFirstVisit();

  // Reroll all of the rocks in the room. This does not work if we do it in the `POST_NEW_ROOM`
  // callback. This does not work if we do it on the 0th frame.
  if (roomFrameCount === 1 && isFirstVisit) {
    useActiveItemTemp(g.p, CollectibleType.D12);
  }
});

// 267
postUpdateBabyFunctionMap.set(RandomBabyType.HARE, () => {
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  const sprite = g.p.GetSprite();
  const framesBeforeTakingDamage = baby.num;

  // This effect should not apply in the starting room to give the player a chance to read the
  // description.
  if (inStartingRoom()) {
    return;
  }

  // Takes damage when standing still.
  if (isEntityMoving(g.p, 1)) {
    g.run.babyCounters = 0;
    sprite.Color = ColorDefault;
    return;
  }

  g.run.babyCounters++;
  if (g.run.babyCounters > framesBeforeTakingDamage) {
    g.run.babyCounters = framesBeforeTakingDamage;
  }

  // Show the player gradually changing color to signify that they are about to take damage.
  const distanceToDamage = g.run.babyCounters / framesBeforeTakingDamage; // From 0 to 1
  const colorValue = 1 - distanceToDamage; // They should go from white to black
  sprite.Color = Color(colorValue, colorValue, colorValue);

  if (g.run.babyCounters === framesBeforeTakingDamage) {
    g.p.TakeDamage(1, DamageFlagZero, EntityRef(g.p), 0);
  }
});

// 270
postUpdateBabyFunctionMap.set(RandomBabyType.PORCUPINE, () => {
  const gameFrameCount = game.GetFrameCount();

  if (gameFrameCount % (5 * GAME_FRAMES_PER_SECOND) === 0) {
    useActiveItemTemp(g.p, CollectibleType.WAIT_WHAT);
  }
});

// 290
postUpdateBabyFunctionMap.set(RandomBabyType.HEART, () => {
  const gameFrameCount = game.GetFrameCount();

  // Ignore the starting room.
  if (inStartingRoom()) {
    return;
  }

  if (gameFrameCount % (5 * GAME_FRAMES_PER_SECOND) === 0) {
    useActiveItemTemp(g.p, CollectibleType.DULL_RAZOR);
    sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  }
});

// 295
postUpdateBabyFunctionMap.set(RandomBabyType.RIDER, () => {
  const activeItem = g.p.GetActiveItem();

  // Keep the pony fully charged.
  if (activeItem === CollectibleType.PONY && g.p.NeedsCharge()) {
    g.p.FullCharge();
    sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
  }
});

// 303
postUpdateBabyFunctionMap.set(RandomBabyType.PIZZA, () => {
  const gameFrameCount = game.GetFrameCount();
  const baby = getCurrentBabyDescription();
  if (baby.delay === undefined) {
    error(`The "delay" attribute was not defined for: ${baby.name}`);
  }

  if (g.run.babyFrame !== 0 && gameFrameCount >= g.run.babyFrame) {
    g.run.babyCounters++;
    g.run.babyFrame = gameFrameCount + baby.delay;
    useActiveItemTemp(g.p, CollectibleType.BROWN_NUGGET);
    if (g.run.babyCounters === 19) {
      // One is already spawned with the initial trigger.
      g.run.babyCounters = 0;
      g.run.babyFrame = 0;
    }
  }
});

// 304
postUpdateBabyFunctionMap.set(RandomBabyType.HOTDOG, () => {
  const gameFrameCount = game.GetFrameCount();
  const hearts = g.p.GetHearts();
  const soulHearts = g.p.GetSoulHearts();
  const boneHearts = g.p.GetBoneHearts();

  if (bigChestExists()) {
    return;
  }

  // Prevent dying animation softlocks.
  if (hearts + soulHearts + boneHearts === 0) {
    return;
  }

  // Constant The Bean effect + flight + explosion immunity + blindfolded.
  if (gameFrameCount % 3 === 0) {
    useActiveItemTemp(g.p, CollectibleType.BEAN);
  }
});

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
  if (baby.time === undefined) {
    error(`The "time" attribute was not defined for: ${baby.name}`);
  }

  // Moving when the timer reaches 0 causes damage.
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
  pseudoRoomClear.postUpdate(RandomBabyType.MOUSE);
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

      g.run.dealingExtraDamage = true;
      g.p.Kill();
      g.run.dealingExtraDamage = false;
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

// 519
postUpdateBabyFunctionMap.set(RandomBabyType.BAGGY_CAP, () => {
  const roomClear = g.r.IsClear();

  // Check all of the doors.
  if (roomClear) {
    return;
  }

  // Check to see if a door opened before the room was clear.
  for (const door of getDoors()) {
    if (door.IsOpen()) {
      door.Close(true);
    }
  }
});

// 511
postUpdateBabyFunctionMap.set(RandomBabyType.TWITCHY, () => {
  const gameFrameCount = game.GetFrameCount();
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  if (gameFrameCount >= g.run.babyFrame) {
    g.run.babyFrame += baby.num;
    if (g.run.babyBool) {
      // Tear rate is increasing.
      g.run.babyCounters++;
      if (g.run.babyCounters === baby.max) {
        g.run.babyBool = false;
      }
    } else {
      // Tear rate is decreasing.
      g.run.babyCounters--;
      if (g.run.babyCounters === baby.min) {
        g.run.babyBool = true;
      }
    }

    g.p.AddCacheFlags(CacheFlag.FIRE_DELAY);
    g.p.EvaluateItems();
  }
});

// 550
postUpdateBabyFunctionMap.set(RandomBabyType.BULLET, () => {
  // Infinite bombs
  g.p.AddBombs(1);
});

// 602
postUpdateBabyFunctionMap.set(RandomBabyType.INVISIBLE, () => {
  const roomFrameCount = g.r.GetFrameCount();

  if (roomFrameCount === 1) {
    // The sprite is a blank PNG, but we also want to remove the shadow. Doing this in the
    // `POST_NEW_ROOM` callback won't work. Doing this on frame 0 won't work.
    g.p.Visible = false;
  }
});
