import {
  findFreePosition,
  getCollectibleMaxCharges,
  getEntities,
  getRandomInt,
  sfxManager,
  spawnCollectible,
  VectorZero,
} from "isaacscript-common";
import { BABIES, UNKNOWN_BABY } from "./babies";
import { ROOM_TYPES_TO_NOT_TRANSFORM } from "./constants";
import g from "./globals";
import { BabyDescription } from "./types/BabyDescription";
import { CollectibleTypeCustom } from "./types/CollectibleTypeCustom";

/**
 * In certain situations, baby effects will prevent a player from entering a Big Chest. If this is
 * the case, we check for the present of a Big Chest and disable the baby effect accordingly.
 */
export function bigChestExists(): boolean {
  const numBigChests = Isaac.CountEntities(
    undefined,
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BIGCHEST,
  );
  return numBigChests > 0;
}

export function getCurrentBaby(): [
  babyType: int,
  baby: BabyDescription,
  valid: boolean,
] {
  const babyType = g.run.babyType;
  if (babyType === null) {
    return [-1, UNKNOWN_BABY, false];
  }

  const baby = BABIES[babyType];
  if (baby === undefined) {
    error(`Baby ${babyType} was not found.`);
  }

  return [babyType, baby, true];
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

    default: {
      error(`The offset direction was an unknown value of: ${offsetDirection}`);
    }
  }

  return Vector(position.X + offsetX, position.Y + offsetY);
}

export function getRandomCollectibleTypeFromPool(
  itemPoolType: ItemPoolType,
): int | undefined {
  g.run.babyBool = true;
  const seed = g.run.room.rng.Next();
  const collectibleType = g.itemPool.GetCollectible(itemPoolType, true, seed);
  g.run.babyBool = false;

  return collectibleType;
}

export function giveItemAndRemoveFromPools(
  collectibleType: CollectibleType | CollectibleTypeCustom,
): void {
  const maxCharges = getCollectibleMaxCharges(collectibleType);
  g.p.AddCollectible(collectibleType, maxCharges, false);
  g.itemPool.RemoveCollectible(collectibleType);
}

export function isRacingPlusEnabled(): boolean {
  return CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT !== -1;
}

export function isRerolledCollectibleBuggedHeart(
  pickup: EntityPickup,
): boolean {
  return (
    pickup.Variant === PickupVariant.PICKUP_HEART &&
    pickup.SubType === HeartSubType.HEART_FULL &&
    pickup.Price === 99
  );
}

export function removeAllFriendlyEntities(): void {
  for (const entity of getEntities()) {
    if (entity.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)) {
      entity.Remove();
    }
  }
}

/** For special babies that transform all special rooms into something else. */
export function shouldTransformRoomType(roomType: RoomType): boolean {
  return !ROOM_TYPES_TO_NOT_TRANSFORM.has(roomType);
}

export function spawnRandomPickup(
  position: Vector,
  velocity: Vector = VectorZero,
  noItems = false,
): void {
  // Spawn a random pickup
  let pickupVariantChoice: int;
  if (noItems) {
    // Exclude trinkets and collectibles
    pickupVariantChoice = getRandomInt(1, 9, g.run.rng);
  } else {
    pickupVariantChoice = getRandomInt(1, 11, g.run.rng);
  }

  const seed = g.run.rng.Next();
  switch (pickupVariantChoice) {
    case 1: {
      // Random heart
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_HEART,
        position,
        velocity,
        undefined,
        0,
        seed,
      );
      break;
    }

    case 2: {
      // Random coin
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COIN,
        position,
        velocity,
        undefined,
        0,
        seed,
      );
      break;
    }

    case 3: {
      // Random key
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_KEY,
        position,
        velocity,
        undefined,
        0,
        seed,
      );
      break;
    }

    case 4: {
      // Random bomb
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_BOMB,
        position,
        velocity,
        undefined,
        0,
        seed,
      );
      break;
    }

    case 5: {
      // Random chest
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_CHEST,
        position,
        velocity,
        undefined,
        0,
        seed,
      );
      break;
    }

    case 6: {
      // Random sack
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_GRAB_BAG,
        position,
        velocity,
        undefined,
        0,
        seed,
      );
      break;
    }

    case 7: {
      // Random battery
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_LIL_BATTERY,
        position,
        velocity,
        undefined,
        0,
        seed,
      );
      break;
    }

    case 8: {
      // Random pill
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_PILL,
        position,
        velocity,
        undefined,
        0,
        seed,
      );
      break;
    }

    case 9: {
      // Random card / rune
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_TAROTCARD,
        position,
        velocity,
        undefined,
        0,
        seed,
      );
      break;
    }

    case 10: {
      // Random trinket
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_TRINKET,
        position,
        velocity,
        undefined,
        0,
        seed,
      );
      break;
    }

    case 11: {
      // Random collectible
      spawnCollectible(CollectibleType.COLLECTIBLE_NULL, position, g.run.rng);
      break;
    }

    default: {
      error(
        `The pickup variant was an unknown value of: ${pickupVariantChoice}`,
      );
    }
  }
}

export function spawnSlot(
  slotVariant: SlotVariant,
  startingPosition: Vector,
  rng: RNG,
): Entity {
  const position = findFreePosition(startingPosition);
  const seed = rng.Next();
  const slot = g.g.Spawn(
    EntityType.ENTITY_SLOT,
    slotVariant,
    position,
    VectorZero,
    undefined,
    0,
    seed,
  );

  Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariant.POOF01,
    PoofSubType.NORMAL,
    position,
    VectorZero,
    undefined,
  );

  sfxManager.Play(SoundEffect.SOUND_SUMMONSOUND);

  return slot;
}
