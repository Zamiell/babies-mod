import {
  findFreePosition,
  getCollectibleMaxCharges,
  getEntities,
  getRandomInt,
  nextSeed,
} from "isaacscript-common";
import { BABIES, UNKNOWN_BABY } from "./babies";
import g from "./globals";
import { BabyDescription } from "./types/BabyDescription";
import { CollectibleTypeCustom } from "./types/enums";

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

export function getCurrentBaby(): [int, BabyDescription, boolean] {
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
): int | undefined {
  g.run.room.seed = nextSeed(g.run.room.seed);
  g.run.babyBool = true;
  const collectibleType = g.itemPool.GetCollectible(
    itemPoolType,
    true,
    g.run.room.seed,
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

export function isRacingPlusEnabled(): boolean {
  return CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT !== -1;
}

export function removeAllFriendlyEntities(): void {
  for (const entity of getEntities()) {
    if (entity.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)) {
      entity.Remove();
    }
  }
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
      // Random heart
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
      // Random coin
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
      // Random key
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
      // Random bomb
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
      // Random chest
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
      // Random sack
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
      // Random battery
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
      // Random pill
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
      // Random card / rune
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
      // Random trinket
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
      // Random collectible
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

export function spawnSlot(
  slotVariant: SlotVariant,
  startingPosition: Vector,
  seed: int,
) {
  const position = findFreePosition(startingPosition);

  g.g.Spawn(
    EntityType.ENTITY_SLOT,
    slotVariant,
    position,
    Vector.Zero,
    undefined,
    0,
    seed,
  );

  Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariant.POOF01,
    PoofSubType.NORMAL,
    position,
    Vector.Zero,
    undefined,
  );

  g.sfx.Play(SoundEffect.SOUND_SUMMONSOUND);
}

/** Helper function to use an active item without showing an animation. */
export function useActiveItem(
  player: EntityPlayer,
  collectibleType: CollectibleType | CollectibleTypeCustom,
): void {
  player.UseActiveItem(collectibleType, false, false, false, false);
}
