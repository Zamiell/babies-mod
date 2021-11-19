import {
  getCollectibleMaxCharges,
  getRandomInt,
  nextSeed,
} from "isaacscript-common";
import g from "./globals";
import { BabyDescription } from "./types/BabyDescription";
import { CollectibleTypeCustom } from "./types/enums";

export function getCurrentBaby(): [int, BabyDescription, boolean] {
  const babyType = g.run.babyType;
  if (babyType === null) {
    return [-1, g.babies[0], false];
  }

  const baby = g.babies[babyType];
  if (baby === undefined) {
    error(`Baby ${babyType} was not found.`);
  }

  return [babyType, baby, true];
}

export function getRandomOffsetPosition(
  position: Vector,
  offsetSize: int,
  seed: int,
): Vector {
  const offsetDirection = getRandomInt(0, 3, seed);

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
): int {
  g.run.room.RNG = nextSeed(g.run.room.RNG);
  g.run.babyBool = true;
  const collectibleType = g.itemPool.GetCollectible(
    itemPoolType,
    true,
    g.run.room.RNG,
  );
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

export function spawnRandomPickup(
  position: Vector,
  velocity: Vector = Vector.Zero,
  noItems = false,
): void {
  // Spawn a random pickup
  g.run.randomSeed = nextSeed(g.run.randomSeed);
  let pickupVariant: int;
  if (noItems) {
    // Exclude trinkets and collectibles
    pickupVariant = getRandomInt(1, 9, g.run.randomSeed);
  } else {
    pickupVariant = getRandomInt(1, 11, g.run.randomSeed);
  }

  g.run.randomSeed = nextSeed(g.run.randomSeed);
  switch (pickupVariant) {
    case 1: {
      // Random Heart
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_HEART,
        position,
        velocity,
        undefined,
        0,
        g.run.randomSeed,
      );
      break;
    }

    case 2: {
      // Random Coin
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COIN,
        position,
        velocity,
        undefined,
        0,
        g.run.randomSeed,
      );
      break;
    }

    case 3: {
      // Random Key
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_KEY,
        position,
        velocity,
        undefined,
        0,
        g.run.randomSeed,
      );
      break;
    }

    case 4: {
      // Random Bomb
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_BOMB,
        position,
        velocity,
        undefined,
        0,
        g.run.randomSeed,
      );
      break;
    }

    case 5: {
      // Random Chest
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_CHEST,
        position,
        velocity,
        undefined,
        0,
        g.run.randomSeed,
      );
      break;
    }

    case 6: {
      // Sack
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_GRAB_BAG,
        position,
        velocity,
        undefined,
        0,
        g.run.randomSeed,
      );
      break;
    }

    case 7: {
      // Lil' Battery
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_LIL_BATTERY,
        position,
        velocity,
        undefined,
        0,
        g.run.randomSeed,
      );
      break;
    }

    case 8: {
      // Random Pill
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_PILL,
        position,
        velocity,
        undefined,
        0,
        g.run.randomSeed,
      );
      break;
    }

    case 9: {
      // Random Card / Rune
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_TAROTCARD,
        position,
        velocity,
        undefined,
        0,
        g.run.randomSeed,
      );
      break;
    }

    case 10: {
      // Random Trinket
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_TRINKET,
        position,
        velocity,
        undefined,
        0,
        g.run.randomSeed,
      );
      break;
    }

    case 11: {
      // Random Collectible
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        position,
        velocity,
        undefined,
        CollectibleType.COLLECTIBLE_NULL,
        g.run.randomSeed,
      );
      break;
    }

    default: {
      error(`The pickup variant was an unknown value of: ${pickupVariant}`);
    }
  }
}
