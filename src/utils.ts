import type {
  ItemConfigTag,
  ItemPoolType,
  SlotVariant,
} from "isaac-typescript-definitions";
import {
  BatterySubType,
  BombSubType,
  CardType,
  CoinSubType,
  CollectibleType,
  EffectVariant,
  EntityFlag,
  EntityType,
  HeartSubType,
  KeySubType,
  LevelCurse,
  MinibossID,
  PickupVariant,
  PillColor,
  PlayerForm,
  PoofSubType,
  RoomType,
  SackSubType,
  SoundEffect,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  GAME_FRAMES_PER_SECOND,
  VectorZero,
  doesEntityExist,
  findFreePosition,
  game,
  getCollectibleMaxCharges,
  getEntities,
  getRandomInt,
  getRandomSetElement,
  hasCollectible,
  hasForm,
  inMinibossRoomOf,
  inRoomType,
  isCharacter,
  isFirstPlayer,
  isHeart,
  isPlayer,
  isRNG,
  removeEntities,
  setSeed,
  sfxManager,
  spawnBattery,
  spawnBombPickup,
  spawnCard,
  spawnCoin,
  spawnEffect,
  spawnHeart,
  spawnKey,
  spawnPickup,
  spawnPill,
  spawnSack,
  spawnSlot,
  spawnTrinket,
} from "isaacscript-common";
import { ROOM_TYPES_TO_NOT_TRANSFORM } from "./constants";
import { CollectibleTypeCustom } from "./enums/CollectibleTypeCustom";
import { PlayerTypeCustom } from "./enums/PlayerTypeCustom";
import { g } from "./globals";
import { mod } from "./mod";

const BAD_MISSING_TEARS_COLLECTIBLE_TYPES = [
  CollectibleType.INNER_EYE, // 2
  CollectibleType.CUPIDS_ARROW, // 48
  CollectibleType.MOMS_EYE, // 55
  CollectibleType.LOKIS_HORNS, // 87
  CollectibleType.MUTANT_SPIDER, // 153
  CollectibleType.POLYPHEMUS, // 169
  CollectibleType.MONSTROS_LUNG, // 229
  CollectibleType.DEATHS_TOUCH, // 237
  CollectibleType.TWENTY_TWENTY, // 245
  CollectibleType.SAGITTARIUS, // 306
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.DEAD_ONION, // 336
  CollectibleType.EYE_OF_BELIAL, // 462
  CollectibleType.LITTLE_HORN, // 503
  CollectibleType.TRISAGION, // 533
  CollectibleType.FLAT_STONE, // 540
] as const;

const BAD_MISSING_TEARS_TRANSFORMATIONS = [
  PlayerForm.CONJOINED, // 7
  PlayerForm.BOOKWORM, // 10
] as const;

/**
 * In certain situations, baby effects will prevent a player from entering a Big Chest. If this is
 * the case, we check for the present of a Big Chest and disable the baby effect accordingly.
 */
export function doesBigChestExist(): boolean {
  return doesEntityExist(EntityType.PICKUP, PickupVariant.BIG_CHEST);
}

export function everyNSeconds(func: () => void, seconds: int): void {
  const gameFrameCount = game.GetFrameCount();
  const gameFrameMatchesSecondsCount =
    gameFrameCount % (seconds * GAME_FRAMES_PER_SECOND) === 0;
  if (gameFrameMatchesSecondsCount) {
    func();
  }
}

export function getRandomOffsetPosition(
  position: Vector,
  offsetSize: int,
  seed: Seed,
): Vector {
  const offsetDirection = getRandomInt(1, 4, seed);

  let offsetX: int;
  let offsetY: int;
  switch (offsetDirection) {
    case 1: {
      // Bottom right
      offsetX = offsetSize;
      offsetY = offsetSize;
      break;
    }

    case 2: {
      // Top right
      offsetX = offsetSize;
      offsetY = offsetSize * -1;
      break;
    }

    case 3: {
      // Bottom left
      offsetX = offsetSize * -1;
      offsetY = offsetSize;
      break;
    }

    case 4: {
      // Top left
      offsetX = offsetSize * -1;
      offsetY = offsetSize * -1;
      break;
    }

    // eslint-disable-next-line isaacscript/require-break
    default: {
      error(`The offset direction was an unknown value of: ${offsetDirection}`);
    }
  }

  return Vector(position.X + offsetX, position.Y + offsetY);
}

export function getRandomCollectibleTypeFromPool(
  itemPoolType: ItemPoolType,
  seedOrRNG: Seed | RNG,
): CollectibleType {
  const itemPool = game.GetItemPool();
  const seed = isRNG(seedOrRNG) ? seedOrRNG.Next() : seedOrRNG;

  g.run.gettingCollectible = true;
  const collectibleType = itemPool.GetCollectible(itemPoolType, true, seed);
  g.run.gettingCollectible = false;

  return collectibleType;
}

export function getRandomCollectibleTypeWithTag(
  itemConfigTag: ItemConfigTag,
): CollectibleType {
  const foodCollectibleTypesSet = mod.getCollectiblesWithTag(itemConfigTag);
  return getRandomSetElement(foodCollectibleTypesSet);
}

export function giveItemAndRemoveFromPools(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): void {
  const itemPool = game.GetItemPool();

  const maxCharges = getCollectibleMaxCharges(collectibleType);
  player.AddCollectible(collectibleType, maxCharges, false);
  itemPool.RemoveCollectible(collectibleType);
}

export function isRacingPlusEnabled(): boolean {
  return (CollectibleTypeCustom.CHECKPOINT as int) !== -1;
}

export function isRerolledCollectibleBuggedHeart(
  pickup: EntityPickup,
): boolean {
  return (
    isHeart(pickup) &&
    pickup.SubType === HeartSubType.FULL &&
    pickup.Price === 99
  );
}

/** Piercing, multiple shots, and Flat Stone causes "missing" effects to mess up. */
export function isValidForMissedTearsEffect(player: EntityPlayer): boolean {
  return (
    !hasCollectible(player, ...BAD_MISSING_TEARS_COLLECTIBLE_TYPES) &&
    !hasForm(player, ...BAD_MISSING_TEARS_TRANSFORMATIONS)
  );
}

export function isValidRandomBabyPlayer(player: EntityPlayer): boolean {
  return (
    // We validate that the `player` is a valid `EntityPlayer` object since we may be getting it in
    // a type-unsafe way in the `Baby.ts` file.
    isPlayer(player) &&
    isCharacter(player, PlayerTypeCustom.RANDOM_BABY) &&
    // Currently, the mod does not support co-op. Many places in logic assume that the player is the
    // first character. This can be removed when all `Isaac.GetPlayer` method calls are removed.
    isFirstPlayer(player) &&
    g.run.babyType !== null
  );
}

/** This is used for several babies. */
export function postNewRoomReorderedNoHealthUI(): void {
  const level = game.GetLevel();

  // Get rid of the health UI by using Curse of the Unknown (but not in Devil Rooms or Black
  // Markets).
  if (shouldShowRealHeartsUIForDevilDeal()) {
    level.RemoveCurses(LevelCurse.UNKNOWN);
  } else {
    level.AddCurse(LevelCurse.UNKNOWN, false);
  }
}

export function removeAllFriendlyEntities(): void {
  const entities = getEntities();
  const friendlyEntities = entities.filter((entity) =>
    entity.HasEntityFlags(EntityFlag.FRIENDLY),
  );
  removeEntities(friendlyEntities);
}

/** Upon granting a new baby, baby RNG objects are set to the current level seed. */
export function setInitialBabyRNG(rng: RNG): void {
  const level = game.GetLevel();
  const seed = level.GetDungeonPlacementSeed();
  setSeed(rng, seed);
}

export function setTearColor(tear: EntityTear, color: Color): void {
  tear.SetColor(color, 10_000, 10_000);
}

export function shouldShowRealHeartsUIForDevilDeal(): boolean {
  const inRoomWithDevilDeals = inRoomType(
    RoomType.DEVIL,
    RoomType.BLACK_MARKET,
  );
  const inKrampusRoom = inMinibossRoomOf(MinibossID.KRAMPUS);

  return inRoomWithDevilDeals && !inKrampusRoom;
}

/** For special babies that transform all special rooms into something else. */
export function shouldTransformRoomType(roomType: RoomType): boolean {
  return !ROOM_TYPES_TO_NOT_TRANSFORM.has(roomType);
}

export function spawnRandomPickup(
  rng: RNG,
  position: Vector,
  velocity: Vector = VectorZero,
  noItems = false,
): void {
  // Spawn a random pickup.
  const pickupVariantChoice = noItems
    ? getRandomInt(1, 9, rng) // Exclude trinkets and collectibles.
    : getRandomInt(1, 11, rng);

  switch (pickupVariantChoice) {
    case 1: {
      // Random heart.
      spawnHeart(HeartSubType.NULL, position, velocity, undefined, rng);
      break;
    }

    case 2: {
      // Random coin.
      spawnCoin(CoinSubType.NULL, position, velocity, undefined, rng);
      break;
    }

    case 3: {
      // Random key.
      spawnKey(KeySubType.NULL, position, velocity, undefined, rng);
      break;
    }

    case 4: {
      // Random bomb.
      spawnBombPickup(BombSubType.NULL, position, velocity, undefined, rng);
      break;
    }

    case 5: {
      // Random chest.
      spawnPickup(PickupVariant.CHEST, 0, position, velocity, undefined, rng);
      break;
    }

    case 6: {
      // Random sack.
      spawnSack(SackSubType.NULL, position, velocity, undefined, rng);
      break;
    }

    case 7: {
      // Random battery.
      spawnBattery(BatterySubType.NULL, position, velocity, undefined, rng);
      break;
    }

    case 8: {
      // Random pill.
      spawnPill(PillColor.NULL, position, velocity, undefined, rng);
      break;
    }

    case 9: {
      // Random card / rune.
      spawnCard(CardType.NULL, position, velocity, undefined, rng);
      break;
    }

    case 10: {
      // Random trinket.
      spawnTrinket(TrinketType.NULL, position, velocity, undefined, rng);
      break;
    }

    case 11: {
      // Random collectible.
      mod.spawnCollectible(CollectibleType.NULL, position, rng);
      break;
    }

    // eslint-disable-next-line isaacscript/require-break
    default: {
      error(
        `The pickup variant was an unknown value of: ${pickupVariantChoice}`,
      );
    }
  }
}

/** Helper function to spawn a slot on a free position, spawn a poof, and play a sound effect. */
export function spawnSlotHelper(
  slotVariant: SlotVariant,
  startingPosition: Vector,
  player: EntityPlayer,
  rng: RNG,
): Entity {
  const position = findFreePosition(startingPosition);
  const slot = spawnSlot(slotVariant, 0, position, VectorZero, player, rng);

  spawnEffect(EffectVariant.POOF_1, PoofSubType.NORMAL, position);
  sfxManager.Play(SoundEffect.SUMMON_SOUND);

  return slot;
}
