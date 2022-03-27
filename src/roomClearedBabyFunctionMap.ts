import {
  addRoomClearCharge,
  getEnumValues,
  getRandomArrayElement,
  repeat,
  spawnCollectible,
  spawnHeart,
  spawnPickup,
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
  spawnHeart(heartSubType, g.p.Position, VectorZero, g.p, roomSeed);
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
  spawnPickup(
    PickupVariant.PICKUP_BOMB,
    0,
    g.p.Position,
    VectorZero,
    g.p,
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
