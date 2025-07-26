import type { SlotVariant } from "isaac-typescript-definitions";
import {
  BatterySubType,
  BombSubType,
  CardType,
  CoinSubType,
  CollectibleType,
  Direction,
  DisplayFlag,
  EffectVariant,
  EntityFlag,
  EntityType,
  HeartSubType,
  ItemPoolType,
  KeySubType,
  LevelCurse,
  LevelStage,
  MinibossID,
  PickupPrice,
  PickupVariant,
  PillColor,
  PoofSubType,
  RoomType,
  SackSubType,
  SoundEffect,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  GAME_FRAMES_PER_SECOND,
  VectorZero,
  addRoomDisplayFlag,
  directionToVector,
  doesEntityExist,
  findFreePosition,
  game,
  getCollectibleMaxCharges,
  getEntities,
  getPlayerFromEntity,
  getRandomArrayElement,
  getRandomEnumValue,
  getRandomInt,
  getRoomsInsideGrid,
  hasCollectible,
  hasForm,
  hasPiercing,
  hasSpectral,
  inMinibossRoomOf,
  inRoomType,
  isCharacter,
  isFirstPlayer,
  isPlayer,
  isRoomVisible,
  onStage,
  onStageOrLower,
  removeEntities,
  setSeed,
  sfxManager,
  spawnBattery,
  spawnBombPickup,
  spawnCard,
  spawnCoin,
  spawnCollectible,
  spawnEffect,
  spawnHeart,
  spawnKey,
  spawnPickup,
  spawnPill,
  spawnSack,
  spawnSlot,
  spawnTrinket,
} from "isaacscript-common";
import { getBabyType } from "./classes/features/babySelection/v";
import {
  BAD_MISSED_TEARS_TRANSFORMATIONS,
  BUGGY_REPLACING_OR_DOUBLING_ENTITY_TYPES_SET,
  BUGGY_REPLACING_OR_DOUBLING_ENTITY_TYPE_VARIANT_SET,
  GOING_TO_NEXT_FLOOR_ANIMATIONS,
  MULTI_SEGMENT_BOSSES,
  ROOM_TYPES_TO_NOT_TRANSFORM,
} from "./constants";
import {
  BAD_MISSED_TEARS_COLLECTIBLE_TYPES,
  COLLECTIBLE_REROLL_COLLECTIBLE_TYPES_SET,
  TRINKET_REROLL_COLLECTIBLE_TYPES_SET,
} from "./constantsCollectibleTypes";
import { PlayerTypeCustom } from "./enums/PlayerTypeCustom";
import type { BabyDescription } from "./interfaces/BabyDescription";
import { mod } from "./mod";

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

export function getBabyCollectiblesSet(
  baby: BabyDescription,
): ReadonlySet<CollectibleType> {
  const babyCollectiblesSet = new Set<CollectibleType>();
  if (baby.collectible !== undefined) {
    babyCollectiblesSet.add(baby.collectible);
  }
  if (baby.collectible2 !== undefined) {
    babyCollectiblesSet.add(baby.collectible2);
  }
  if (baby.collectible3 !== undefined) {
    babyCollectiblesSet.add(baby.collectible3);
  }

  return babyCollectiblesSet;
}

/**
 * A combination of `getPlayerFromEntity` (from `isaacscript-common`) and `isValidRandomBabyPlayer`.
 */
export function getBabyPlayerFromEntity(
  entity: Entity,
): EntityPlayer | undefined {
  const player = getPlayerFromEntity(entity);
  if (player === undefined) {
    return undefined;
  }

  if (!isValidRandomBabyPlayer(player)) {
    return undefined;
  }

  return player;
}

export function getRandomOffsetPosition(
  position: Vector,
  offsetSize: int,
  seed: Seed,
): Readonly<Vector> {
  const randomDirection = getRandomEnumValue(Direction, seed, [
    Direction.NO_DIRECTION,
  ]);
  const vector = directionToVector(randomDirection);
  const offset = vector.mul(offsetSize);

  return position.add(offset);
}

export function giveCollectibleAndRemoveFromPools(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): void {
  const itemPool = game.GetItemPool();

  const maxCharges = getCollectibleMaxCharges(collectibleType);
  player.AddCollectible(collectibleType, maxCharges, false);
  itemPool.RemoveCollectible(collectibleType);
}

export function hasSpectralOrSpectralLikeEffect(player: EntityPlayer): boolean {
  return (
    hasSpectral(player)
    || hasCollectible(
      player,
      CollectibleType.MOMS_KNIFE, // 114
      CollectibleType.BRIMSTONE, // 118
      CollectibleType.C_SECTION, // 678
    )
  );
}

export function hasPiercingOrPiercingLikeEffect(player: EntityPlayer): boolean {
  return (
    hasPiercing(player)
    || hasCollectible(
      player,
      CollectibleType.MOMS_KNIFE, // 114
      CollectibleType.BRIMSTONE, // 118
      CollectibleType.C_SECTION, // 678
    )
  );
}

export function isCollectibleRerollCollectibleType(
  collectibleType: CollectibleType,
): boolean {
  return COLLECTIBLE_REROLL_COLLECTIBLE_TYPES_SET.has(collectibleType);
}

export function isTrinketRerollCollectibleType(
  collectibleType: CollectibleType,
): boolean {
  return TRINKET_REROLL_COLLECTIBLE_TYPES_SET.has(collectibleType);
}

export function isPlayerGoingToNextFloor(player: EntityPlayer): boolean {
  const room = game.GetRoom();
  const roomFrameCount = room.GetFrameCount();
  const sprite = player.GetSprite();
  const animation = sprite.GetAnimation();

  // When going to a new floor, the player's animation will be "TrapdoorCustom" in the starting room
  // of the new floor for 7 frames. Thus, we have to wait for the room frame count to tick higher
  // than that.
  return roomFrameCount > 7 && GOING_TO_NEXT_FLOOR_ANIMATIONS.has(animation);
}

/**
 * Detecting a priced Devil-Deal-style collectible is normally trivial because you can check for if
 * the price is less than 0 and is not `PickupPrice.YOUR_SOUL` or `PickupPrice.FREE`. However, this
 * does not work on Keeper, because all Devil-Deal-style collectibles cost money. Furthermore, this
 * does not work on Tainted Keeper, because all collectibles cost money. It also fails with the
 * Keeper's Bargain trinket for the same reason.
 *
 * This function is from Racing+.
 */
export function isPricedDevilRoomPoolCollectible(
  collectible: EntityPickupCollectible,
): boolean {
  const itemPoolType = mod.getCollectibleItemPoolType(collectible);

  return (
    itemPoolType === ItemPoolType.DEVIL
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    && collectible.Price !== PickupPrice.NULL
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    && collectible.Price !== PickupPrice.YOUR_SOUL
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    && collectible.Price !== PickupPrice.FREE
    && collectible.Price !== -10 // `PickupPriceCustom.PRICE_FREE_DEVIL_DEAL` from Racing+
  );
}

export function isRacingPlusEnabled(): boolean {
  const checkpoint = Isaac.GetItemIdByName("Checkpoint") as
    | CollectibleType
    | -1;
  return checkpoint !== -1;
}

export function isValidForEnemyDeathEffect(entity: Entity): boolean {
  const npc = entity.ToNPC();
  return (
    npc !== undefined
    // Racing+ manually kills pitfalls to make them disappear faster.
    && npc.Type !== EntityType.PITFALL
    && !MULTI_SEGMENT_BOSSES.has(npc.Type)
  );
}

/** Piercing, multiple shots, Flat Stone, and other things cause "missing" effects to mess up. */
export function isValidForMissedTearsEffect(player: EntityPlayer): boolean {
  return (
    !hasCollectible(player, ...BAD_MISSED_TEARS_COLLECTIBLE_TYPES)
    && !hasForm(player, ...BAD_MISSED_TEARS_TRANSFORMATIONS)
  );
}

export function isValidRandomBabyPlayer(player: EntityPlayer): boolean {
  return (
    // We validate that the `player` is a valid `EntityPlayer` object since we may be getting it in
    // a type-unsafe way in the `Baby.ts` file.
    isPlayer(player)
    // Currently, the mod does not support co-op. Many places in logic assume that the player is the
    // first character. This can be removed when all `Isaac.GetPlayer` method calls are removed.
    && isFirstPlayer(player)
    && isCharacter(player, PlayerTypeCustom.RANDOM_BABY)
    && getBabyType() !== undefined
  );
}

/**
 * Sheol, Cathedral, and Home are stages where the player does not get any collectibles. (We do not
 * count the collectible from Mom's Chest, since it is not very good most times.)
 */
export function onStageWithCollectibles(): boolean {
  return !onStage(LevelStage.SHEOL_CATHEDRAL, LevelStage.HOME);
}

export function onStageWithSpecialRooms(): boolean {
  return onStageOrLower(LevelStage.SHEOL_CATHEDRAL);
}

/** This is used for babies that have special health mechanics. */
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

export function revealRandomRoom(rng: RNG): void {
  const roomsInsideGrid = getRoomsInsideGrid();
  const nonVisibleRooms = roomsInsideGrid.filter(
    (roomDescriptor) => !isRoomVisible(roomDescriptor),
  );
  if (nonVisibleRooms.length === 0) {
    return;
  }

  const randomRoom = getRandomArrayElement(nonVisibleRooms, rng);
  addRoomDisplayFlag(randomRoom.SafeGridIndex, DisplayFlag.VISIBLE);
}

/** Upon granting a new baby, RNG objects are set to a seed based on the current floor. */
export function setInitialBabyRNG(rng: RNG): void {
  const level = game.GetLevel();
  const seed = level.GetDungeonPlacementSeed();
  setSeed(rng, seed);
}

export function setTearColor(tear: EntityTear, color: Color): void {
  tear.SetColor(color, 10_000, 10_000);
}

export function shouldReplaceOrDuplicateNPC(npc: EntityNPC): boolean {
  const entityTypeVariant = `${npc.Type}.${npc.Variant}`;

  return (
    // We cannot use the `EntityNPC.IsVulnerableEnemy` method because since the enemy is dead at
    // this point, the check will fail.
    !npc.IsBoss()
    && !npc.HasEntityFlags(EntityFlag.FRIENDLY)
    && !BUGGY_REPLACING_OR_DOUBLING_ENTITY_TYPES_SET.has(npc.Type)
    && !BUGGY_REPLACING_OR_DOUBLING_ENTITY_TYPE_VARIANT_SET.has(
      entityTypeVariant,
    )
  );
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
): EntityPickup {
  // Spawn a random pickup.
  const pickupVariantChoice = noItems
    ? getRandomInt(1, 9, rng) // Exclude trinkets and collectibles.
    : getRandomInt(1, 11, rng);

  switch (pickupVariantChoice) {
    // Random heart.
    case 1: {
      return spawnHeart(HeartSubType.NULL, position, velocity, undefined, rng);
    }

    // Random coin.
    case 2: {
      return spawnCoin(CoinSubType.NULL, position, velocity, undefined, rng);
    }

    // Random key.
    case 3: {
      return spawnKey(KeySubType.NULL, position, velocity, undefined, rng);
    }

    // Random bomb.
    case 4: {
      return spawnBombPickup(
        BombSubType.NULL,
        position,
        velocity,
        undefined,
        rng,
      );
    }

    // Random chest.
    case 5: {
      return spawnPickup(
        PickupVariant.CHEST,
        0,
        position,
        velocity,
        undefined,
        rng,
      );
    }

    // Random sack.
    case 6: {
      return spawnSack(SackSubType.NULL, position, velocity, undefined, rng);
    }

    // Random battery.
    case 7: {
      return spawnBattery(
        BatterySubType.NULL,
        position,
        velocity,
        undefined,
        rng,
      );
    }

    // Random pill.
    case 8: {
      return spawnPill(PillColor.NULL, position, velocity, undefined, rng);
    }

    // Random card / rune.
    case 9: {
      return spawnCard(CardType.NULL, position, velocity, undefined, rng);
    }

    // Random trinket.
    case 10: {
      return spawnTrinket(TrinketType.NULL, position, velocity, undefined, rng);
    }

    // Random collectible.
    case 11: {
      return spawnCollectible(CollectibleType.NULL, position, rng);
    }

    default: {
      return error(
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
