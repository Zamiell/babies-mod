import {
  BatterySubType,
  Card,
  CoinSubType,
  CollectibleType,
  EffectVariant,
  EntityFlag,
  EntityType,
  HeartSubType,
  ItemPoolType,
  KeySubType,
  PickupVariant,
  PillColor,
  PoofSubType,
  RoomType,
  SackSubType,
  SlotVariant,
  SoundEffect,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  findFreePosition,
  getCollectibleMaxCharges,
  getEntities,
  getRandomInt,
  sfxManager,
  spawnBattery,
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
  VectorZero,
} from "isaacscript-common";
import { ROOM_TYPES_TO_NOT_TRANSFORM } from "./constants";
import { RandomBabyType } from "./enums/RandomBabyType";
import g from "./globals";
import { BABIES, UNKNOWN_BABY } from "./objects/babies";
import { BabyDescription } from "./types/BabyDescription";
import { CollectibleTypeCustom } from "./types/CollectibleTypeCustom";

/**
 * In certain situations, baby effects will prevent a player from entering a Big Chest. If this is
 * the case, we check for the present of a Big Chest and disable the baby effect accordingly.
 */
export function bigChestExists(): boolean {
  const numBigChests = Isaac.CountEntities(
    undefined,
    EntityType.PICKUP,
    PickupVariant.BIG_CHEST,
  );
  return numBigChests > 0;
}

export function getCurrentBaby(): [
  // Normally, we would use "undefined" instead of "-1", but tuples cannot contain undefined in
  // TypeScriptToLua.
  babyType: RandomBabyType | -1,
  baby: BabyDescription,
] {
  const { babyType } = g.run;
  if (babyType === null) {
    return [-1, UNKNOWN_BABY];
  }

  const baby = BABIES[babyType];
  return [babyType, baby];
}

export function getCurrentBabyDescription(): BabyDescription {
  const [, baby] = getCurrentBaby();
  return baby;
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
): CollectibleType | undefined {
  g.run.babyBool = true;
  const seed = g.run.room.rng.Next();
  const collectibleType = g.itemPool.GetCollectible(itemPoolType, true, seed);
  g.run.babyBool = false;

  return collectibleType;
}

export function giveItemAndRemoveFromPools(
  collectibleType: CollectibleType,
): void {
  const maxCharges = getCollectibleMaxCharges(collectibleType);
  g.p.AddCollectible(collectibleType, maxCharges, false);
  g.itemPool.RemoveCollectible(collectibleType);
}

export function isRacingPlusEnabled(): boolean {
  return (CollectibleTypeCustom.CHECKPOINT as int) !== -1;
}

export function isRerolledCollectibleBuggedHeart(
  pickup: EntityPickup,
): boolean {
  return (
    pickup.Variant === PickupVariant.HEART &&
    pickup.SubType === (HeartSubType.FULL as int) &&
    pickup.Price === 99
  );
}

export function removeAllFriendlyEntities(): void {
  for (const entity of getEntities()) {
    if (entity.HasEntityFlags(EntityFlag.FRIENDLY)) {
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
  // Spawn a random pickup.
  let pickupVariantChoice: int;
  if (noItems) {
    // Exclude trinkets and collectibles.
    pickupVariantChoice = getRandomInt(1, 9, g.run.rng);
  } else {
    pickupVariantChoice = getRandomInt(1, 11, g.run.rng);
  }

  const seed = g.run.rng.Next();
  switch (pickupVariantChoice) {
    case 1: {
      // Random heart.
      spawnHeart(HeartSubType.NULL, position, velocity, undefined, seed);
      break;
    }

    case 2: {
      // Random coin.
      spawnCoin(CoinSubType.NULL, position, velocity, undefined, seed);
      break;
    }

    case 3: {
      // Random key.
      spawnKey(KeySubType.NULL, position, velocity, undefined, seed);
      break;
    }

    case 4: {
      // Random bomb.
      spawnPickup(PickupVariant.BOMB, 0, position, velocity, undefined, seed);
      break;
    }

    case 5: {
      // Random chest.
      spawnPickup(PickupVariant.CHEST, 0, position, velocity, undefined, seed);
      break;
    }

    case 6: {
      // Random sack.
      spawnSack(SackSubType.NULL, position, velocity, undefined, seed);
      break;
    }

    case 7: {
      // Random battery.
      spawnBattery(BatterySubType.NULL, position, velocity, undefined, seed);
      break;
    }

    case 8: {
      // Random pill.
      spawnPill(PillColor.NULL, position, velocity, undefined, seed);
      break;
    }

    case 9: {
      // Random card / rune.
      spawnCard(Card.NULL, position, velocity, undefined, seed);
      break;
    }

    case 10: {
      // Random trinket.
      spawnTrinket(TrinketType.NULL, position, velocity, undefined, seed);
      break;
    }

    case 11: {
      // Random collectible.
      spawnCollectible(CollectibleType.NULL, position, g.run.rng);
      break;
    }

    default: {
      error(
        `The pickup variant was an unknown value of: ${pickupVariantChoice}`,
      );
    }
  }
}

export function spawnSlotHelper(
  slotVariant: SlotVariant,
  startingPosition: Vector,
  rng: RNG,
): Entity {
  const position = findFreePosition(startingPosition);
  const seed = rng.Next();
  const slot = spawnSlot(slotVariant, 0, position, VectorZero, undefined, seed);

  spawnEffect(EffectVariant.POOF_1, PoofSubType.NORMAL, position);
  sfxManager.Play(SoundEffect.SUMMON_SOUND);

  return slot;
}
