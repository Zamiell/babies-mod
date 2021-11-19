import { getCollectibleMaxCharges, nextSeed } from "isaacscript-common";
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

export function getOffsetPosition(
  position: Vector,
  offsetSize: int,
  seed: int,
): Vector {
  math.randomseed(seed);
  const offsetDirection = math.random(1, 4);

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
  // Get a new item from this pool
  g.run.room.RNG = nextSeed(g.run.room.RNG);
  g.run.babyBool = true; // The next line will cause this callback to be re-entered
  const collectibleType = g.itemPool.GetCollectible(
    itemPoolType,
    true,
    g.run.room.RNG,
  );
  g.run.babyBool = false;

  return collectibleType;
}

export function getRoomIndex(): int {
  const roomIndex = g.l.GetCurrentRoomDesc().SafeGridIndex;
  if (roomIndex < 0) {
    // SafeGridIndex is always -1 for rooms outside the grid
    return g.l.GetCurrentRoomIndex();
  }

  return roomIndex;
}

// Taken from Alphabirth
// https://steamcommunity.com/sharedfiles/filedetails/?id=848056541
export function getScreenCenterPosition(): Vector {
  const shape = g.r.GetRoomShape();
  const centerPos = g.r.GetCenterPos();
  const topLeftPos = g.r.GetTopLeftPos();
  const centerOffset = centerPos.sub(topLeftPos);
  const pos = centerPos;

  if (centerOffset.X > 260) {
    pos.X -= 260;
  }
  if (shape === RoomShape.ROOMSHAPE_LBL || shape === RoomShape.ROOMSHAPE_LTL) {
    pos.X -= 260;
  }
  if (centerOffset.Y > 140) {
    pos.Y -= 140;
  }
  if (shape === RoomShape.ROOMSHAPE_LTR || shape === RoomShape.ROOMSHAPE_LTL) {
    pos.Y -= 140;
  }

  return Isaac.WorldToRenderPosition(pos);
}

export function giveItemAndRemoveFromPools(
  collectibleType: CollectibleType | CollectibleTypeCustom,
): void {
  const maxCharges = getCollectibleMaxCharges(collectibleType);
  g.p.AddCollectible(collectibleType, maxCharges, false);
  g.itemPool.RemoveCollectible(collectibleType);
}

export function gridToPos(x: number, y: number): Vector {
  x += 1;
  y += 1;

  return g.r.GetGridPosition(y * g.r.GetGridWidth() + x);
}

export function isActionPressed(buttonAction: ButtonAction): boolean {
  // There are 4 possible inputs/players from 0 to 3
  for (let i = 0; i <= 3; i++) {
    if (Input.IsActionPressed(buttonAction, i)) {
      return true;
    }
  }

  return false;
}

export function openAllDoors(): void {
  for (let i = 0; i <= 7; i++) {
    const door = g.r.GetDoor(i);
    if (door !== undefined) {
      // If we try to open a hidden secret room door (or super secret room door),
      // then nothing will happen
      door.Open();
    }
  }
}

// Set the entity to a random color
// (used for 404 Baby)
export function setRandomColor(entity: Entity): void {
  const colorValues: int[] = [];
  let seed = entity.InitSeed;
  for (let i = 0; i < 3; i++) {
    seed = nextSeed(seed);
    math.randomseed(seed);
    let colorValue = math.random(0, 200);
    colorValue /= 100;
    colorValues.push(colorValue);
  }
  const color = Color(
    colorValues[0],
    colorValues[1],
    colorValues[2],
    1,
    1,
    1,
    1,
  );
  entity.SetColor(color, 10000, 10000, false, false);
}

export function spawnRandomPickup(
  position: Vector,
  velocity: Vector = Vector.Zero,
  noItems = false,
): void {
  // Spawn a random pickup
  g.run.randomSeed = nextSeed(g.run.randomSeed);
  math.randomseed(g.run.randomSeed);
  let pickupVariant: int;
  if (noItems) {
    // Exclude trinkets and collectibles
    pickupVariant = math.random(1, 9);
  } else {
    pickupVariant = math.random(1, 11);
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
