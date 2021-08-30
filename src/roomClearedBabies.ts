import { ZERO_VECTOR } from "./constants";
import g from "./globals";
import { addCharge } from "./misc";

const functionMap = new LuaTable<int, () => void>();
export default functionMap;

// Love Baby
functionMap.set(1, () => {
  const roomSeed = g.r.GetSpawnSeed();
  math.randomseed(roomSeed);
  const heartSubType = math.random(1, 11); // From "Heart" to "Bone Heart"

  // Random Heart
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_HEART,
    heartSubType,
    g.p.Position,
    ZERO_VECTOR,
    g.p,
  );
});

// Bandaid Baby
functionMap.set(88, () => {
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
    ZERO_VECTOR,
    g.p,
    0,
    roomSeed,
  );
});

// Jammies Baby
functionMap.set(192, () => {
  // Extra charge per room cleared
  addCharge();
});

// Fishman Baby
functionMap.set(384, () => {
  const roomSeed = g.r.GetSpawnSeed();

  // Random Bomb
  g.g.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BOMB,
    g.p.Position,
    ZERO_VECTOR,
    g.p,
    0,
    roomSeed,
  );
});
