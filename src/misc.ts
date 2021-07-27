import { ZERO_VECTOR } from "./constants";
import g from "./globals";
import log from "./log";
import BabyDescription from "./types/BabyDescription";
import { CollectibleTypeCustom } from "./types/enums";

// Copied from the Racing+ mod (RPFastClear.lua)
export function addCharge(singleCharge = false): void {
  const roomShape = g.r.GetRoomShape();
  const activeItem = g.p.GetActiveItem();
  const activeCharge = g.p.GetActiveCharge();
  const batteryCharge = g.p.GetBatteryCharge();
  const activeItemMaxCharges = getItemMaxCharges(activeItem);

  if (!g.p.NeedsCharge()) {
    return;
  }

  // Find out if we are in a 2x2 or an L room
  let chargesToAdd = 1;
  if (roomShape >= 8) {
    // L rooms and 2x2 rooms should grant 2 charges
    chargesToAdd = 2;
  } else if (
    g.p.HasTrinket(TrinketType.TRINKET_AAA_BATTERY) &&
    activeCharge === activeItemMaxCharges - 2
  ) {
    // The AAA Battery grants an extra charge when the active item is one away from being fully
    // charged
    chargesToAdd = 2;
  } else if (
    g.p.HasTrinket(TrinketType.TRINKET_AAA_BATTERY) &&
    activeCharge === activeItemMaxCharges &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY) &&
    batteryCharge === activeItemMaxCharges - 2
  ) {
    // The AAA Battery should grant an extra charge when the active item is one away from being
    // fully charged with The Battery (this is bugged in vanilla for The Battery)
    chargesToAdd = 2;
  }

  // We might only want to add a single charge to the active item in certain situations
  if (singleCharge) {
    chargesToAdd = 1;
  }

  // Add the correct amount of charges
  const currentCharge = g.p.GetActiveCharge();
  g.p.SetActiveCharge(currentCharge + chargesToAdd);
}

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

// Copied from the Racing+ mod
export function getHeartXOffset(): number {
  const curses = g.l.GetCurses();
  const maxHearts = g.p.GetMaxHearts();
  const soulHearts = g.p.GetSoulHearts();
  const boneHearts = g.p.GetBoneHearts();
  const extraLives = g.p.GetExtraLives();

  const heartLength = 12; // This is how long each heart is on the UI in the upper left hand corner
  // (this is not in pixels, but in draw coordinates;
  // you can see that it is 13 pixels wide in the "ui_hearts.png" file)
  let combinedHearts = maxHearts + soulHearts + boneHearts * 2; // There are no half bone hearts
  if (combinedHearts > 12) {
    combinedHearts = 12; // After 6 hearts, it wraps to a second row
  }

  if (curses === LevelCurse.CURSE_OF_THE_UNKNOWN) {
    combinedHearts = 2;
  }

  let offset = (combinedHearts / 2) * heartLength;
  if (extraLives > 9) {
    offset += 20;
    if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR)) {
      offset += 6;
    }
  } else if (extraLives > 0) {
    offset += 16;
    if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR)) {
      offset += 4;
    }
  }

  return offset;
}

export function getItemConfig(itemID: number): Readonly<ItemConfigItem> {
  if (itemID <= 0) {
    error(`getItemConfig was passed an invalid item ID of: ${itemID}`);
  }

  return g.itemConfig.GetCollectible(itemID);
}

export function getItemHeartPrice(itemID: int): int {
  const maxHearts = g.p.GetMaxHearts();

  // Find out how this item should be priced
  if (itemID === 0) {
    return 0;
  }
  if (maxHearts === 0) {
    return -3;
  }

  // The "DevilPrice" attribute will be 1 by default (for items like Sad Onion, etc.)
  return getItemConfig(itemID).DevilPrice * -1;
}

// Find out how many charges this item has
export function getItemMaxCharges(itemID: number): int {
  return getItemConfig(itemID).MaxCharges;
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

export function getRandomItemFromPool(itemPoolType: ItemPoolType): int {
  // Get a new item from this pool
  g.run.room.RNG = incrementRNG(g.run.room.RNG);
  g.run.babyBool = true; // The next line will cause this callback to be re-entered
  const item = g.itemPool.GetCollectible(itemPoolType, true, g.run.room.RNG);
  g.run.babyBool = false;

  return item;
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
  const maxCharges = getItemMaxCharges(collectibleType);
  g.p.AddCollectible(collectibleType, maxCharges, false);
  g.itemPool.RemoveCollectible(collectibleType);
}

export function gridToPos(x: number, y: number): Vector {
  x += 1;
  y += 1;

  return g.r.GetGridPosition(y * g.r.GetGridWidth() + x);
}

export function incrementRNG(seed: number): number {
  // The game expects seeds in the range of 0 to 4294967295
  const rng = RNG();
  rng.SetSeed(seed, 35);
  // This is the ShiftIdx that blcd recommended after having reviewing the game's internal functions
  rng.Next();
  const newSeed = rng.GetSeed();

  return newSeed;
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
    if (door !== null) {
      // If we try to open a hidden secret room door (or super secret room door),
      // then nothing will happen
      door.Open();
    }
  }
}

export function removeItemFromItemTracker(
  collectibleType: CollectibleType | CollectibleTypeCustom,
): void {
  const itemConfig = g.itemConfig.GetCollectible(collectibleType);
  log(`Removing collectible ${collectibleType} (${itemConfig.Name})`);
}

// Set the entity to a random color
// (used for 404 Baby)
export function setRandomColor(entity: Entity): void {
  const colorValues: int[] = [];
  let seed = entity.InitSeed;
  for (let i = 0; i < 3; i++) {
    seed = incrementRNG(seed);
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
  velocity: Vector = ZERO_VECTOR,
  noItems = false,
): void {
  // Spawn a random pickup
  g.run.randomSeed = incrementRNG(g.run.randomSeed);
  math.randomseed(g.run.randomSeed);
  let pickupVariant: int;
  if (noItems) {
    // Exclude trinkets and collectibles
    pickupVariant = math.random(1, 9);
  } else {
    pickupVariant = math.random(1, 11);
  }
  g.run.randomSeed = incrementRNG(g.run.randomSeed);

  switch (pickupVariant) {
    case 1: {
      // Random Heart
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_HEART,
        position,
        velocity,
        null,
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
        null,
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
        null,
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
        null,
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
        null,
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
        null,
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
        null,
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
        null,
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
        null,
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
        null,
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
        null,
        0,
        g.run.randomSeed,
      );
      break;
    }

    default: {
      error(`The pickup variant was an unknown value of: ${pickupVariant}`);
    }
  }
}
