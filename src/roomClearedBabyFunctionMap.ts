import { addRoomClearCharge, getRandomHeartSubType } from "isaacscript-common";
import g from "./globals";
import { useActiveItem } from "./util";

export const roomClearedBabyFunctionMap = new Map<int, () => void>();

// Love Baby
roomClearedBabyFunctionMap.set(1, () => {
  const roomSeed = g.r.GetSpawnSeed();
  const heartSubType = getRandomHeartSubType(roomSeed);

  // Random Heart
  g.g.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_HEART,
    g.p.Position,
    Vector.Zero,
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
  g.g.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    position,
    Vector.Zero,
    g.p,
    CollectibleType.COLLECTIBLE_NULL,
    roomSeed,
  );
});

// Jammies Baby
roomClearedBabyFunctionMap.set(192, () => {
  // Extra charge per room cleared
  addRoomClearCharge(g.p);
});

// 2600 Baby
roomClearedBabyFunctionMap.set(347, () => {
  useActiveItem(g.p, CollectibleType.COLLECTIBLE_FRIEND_FINDER);
});

// Fishman Baby
roomClearedBabyFunctionMap.set(384, () => {
  const roomSeed = g.r.GetSpawnSeed();

  // Random Bomb
  g.g.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BOMB,
    g.p.Position,
    Vector.Zero,
    g.p,
    0,
    roomSeed,
  );
});
