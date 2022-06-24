import {
  CollectibleType,
  HeartSubType,
  PickupVariant,
  RoomType,
} from "isaac-typescript-definitions";
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
import { getCurrentBabyDescription } from "./utils";

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

  if (roomType === RoomType.BOSS) {
    return;
  }

  // Random collectible
  const position = g.r.FindFreePickupSpawnPosition(g.p.Position, 1, true);
  spawnCollectible(CollectibleType.NULL, position, roomSeed);
});

// Jammies Baby
roomClearedBabyFunctionMap.set(192, () => {
  // Extra charge per room cleared.
  addRoomClearCharge(g.p);
});

// 2600 Baby
roomClearedBabyFunctionMap.set(347, () => {
  useActiveItemTemp(g.p, CollectibleType.FRIEND_FINDER);
});

// Fishman Baby
roomClearedBabyFunctionMap.set(384, () => {
  const roomSeed = g.r.GetSpawnSeed();

  // Random Bomb
  spawnPickup(PickupVariant.BOMB, 0, g.p.Position, VectorZero, g.p, roomSeed);
});

// Hive King Baby
roomClearedBabyFunctionMap.set(546, () => {
  let gaveGiantCell = false;
  if (g.p.HasCollectible(CollectibleType.GIANT_CELL)) {
    g.p.AddCollectible(CollectibleType.GIANT_CELL, 0, false);
    gaveGiantCell = true;
  }

  useActiveItemTemp(g.p, CollectibleType.DULL_RAZOR);

  if (gaveGiantCell) {
    g.p.RemoveCollectible(CollectibleType.GIANT_CELL);
  }
});

// Pegasus Baby
roomClearedBabyFunctionMap.set(542, () => {
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  repeat(baby.num, () => {
    useActiveItemTemp(g.p, CollectibleType.KEEPERS_BOX);
  });
});
