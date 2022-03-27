import {
  addRoomClearCharge,
  getEnumValues,
  getRandomArrayElement,
  repeat,
  spawnCollectible,
  useActiveItemTemp,
  VectorZero,
} from "isaacscript-common";
import g from "./globals";
import { getCurrentBaby } from "./utils";

export const roomClearedBabyFunctionMap = new Map<int, () => void>();

// Love Baby
roomClearedBabyFunctionMap.set(1, () => {
  const roomSeed = g.r.GetSpawnSeed();
  const heartSubTypes = getEnumValues(HeartSubType);
  const heartSubType = getRandomArrayElement(heartSubTypes, roomSeed);

  // Random Heart
  g.g.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_HEART,
    g.p.Position,
    VectorZero,
    g.p,
    heartSubType,
    roomSeed,
  );
});

// Bandaid Baby
roomClearedBabyFunctionMap.set(88, () => {
  const roomType = g.r.GetType();
  const roomSeed = g.r.GetSpawnSeed();

  if (roomType === RoomType.ROOM_BOSS) {
    return;
  }

  // Random collectible
  const position = g.r.FindFreePickupSpawnPosition(g.p.Position, 1, true);
  spawnCollectible(CollectibleType.COLLECTIBLE_NULL, position, roomSeed);
});

// Jammies Baby
roomClearedBabyFunctionMap.set(192, () => {
  // Extra charge per room cleared
  addRoomClearCharge(g.p);
});

// 2600 Baby
roomClearedBabyFunctionMap.set(347, () => {
  useActiveItemTemp(g.p, CollectibleType.COLLECTIBLE_FRIEND_FINDER);
});

// Fishman Baby
roomClearedBabyFunctionMap.set(384, () => {
  const roomSeed = g.r.GetSpawnSeed();

  // Random Bomb
  g.g.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BOMB,
    g.p.Position,
    VectorZero,
    g.p,
    0,
    roomSeed,
  );
});

// Hive King Baby
roomClearedBabyFunctionMap.set(546, () => {
  let gaveGiantCell = false;
  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_GIANT_CELL)) {
    g.p.AddCollectible(CollectibleType.COLLECTIBLE_GIANT_CELL, 0, false);
    gaveGiantCell = true;
  }

  useActiveItemTemp(g.p, CollectibleType.COLLECTIBLE_DULL_RAZOR);

  if (gaveGiantCell) {
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_GIANT_CELL);
  }
});

// Pegasus Baby
roomClearedBabyFunctionMap.set(542, () => {
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  repeat(baby.num, () => {
    useActiveItemTemp(g.p, CollectibleType.COLLECTIBLE_KEEPERS_BOX);
  });
});
