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
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";
import { getCurrentBabyDescription } from "../utils";

export const postRoomClearChangedBabyFunctionMap = new Map<
  RandomBabyType,
  () => void
>();

// 1
postRoomClearChangedBabyFunctionMap.set(RandomBabyType.LOVE, () => {
  const roomSeed = g.r.GetSpawnSeed();
  const heartSubTypes = getEnumValues(HeartSubType);
  const heartSubType = getRandomArrayElement(heartSubTypes, roomSeed);

  // Random Heart
  spawnHeart(heartSubType, g.p.Position, VectorZero, g.p, roomSeed);
});

// 88
postRoomClearChangedBabyFunctionMap.set(RandomBabyType.BANDAID, () => {
  const roomType = g.r.GetType();
  const roomSeed = g.r.GetSpawnSeed();

  if (roomType === RoomType.BOSS) {
    return;
  }

  // Random collectible
  const position = g.r.FindFreePickupSpawnPosition(g.p.Position, 1, true);
  spawnCollectible(CollectibleType.NULL, position, roomSeed);
});

// 192
postRoomClearChangedBabyFunctionMap.set(RandomBabyType.JAMMIES, () => {
  // Extra charge per room cleared.
  addRoomClearCharge(g.p);
});

// 347
postRoomClearChangedBabyFunctionMap.set(RandomBabyType.N_2600, () => {
  useActiveItemTemp(g.p, CollectibleType.FRIEND_FINDER);
});

// 384
postRoomClearChangedBabyFunctionMap.set(RandomBabyType.FISHMAN, () => {
  const roomSeed = g.r.GetSpawnSeed();

  // Random Bomb
  spawnPickup(PickupVariant.BOMB, 0, g.p.Position, VectorZero, g.p, roomSeed);
});

// 546
postRoomClearChangedBabyFunctionMap.set(RandomBabyType.HIVE_KING, () => {
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

// 542
postRoomClearChangedBabyFunctionMap.set(RandomBabyType.PEGASUS, () => {
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  repeat(baby.num, () => {
    useActiveItemTemp(g.p, CollectibleType.KEEPERS_BOX);
  });
});
