import g from "../globals";

const GRID_ENTITY_REPLACEMENT_EXCEPTIONS = new Set([
  GridEntityXMLType.PRESSURE_PLATE,
  GridEntityXMLType.TRAPDOOR,
  GridEntityXMLType.STAIRS,
]);

export const preRoomEntitySpawnBabyFunctionMap = new Map<
  int,
  (entityType: EntityType) => [int, int, int] | void
>();

// Chompers Baby
preRoomEntitySpawnBabyFunctionMap.set(143, (entityType: int) => {
  if (
    g.r.IsFirstVisit() &&
    entityType >= 1000 && // We only care about grid entities
    !GRID_ENTITY_REPLACEMENT_EXCEPTIONS.has(entityType) // Make an exception for certain entities
  ) {
    // Everything is Red Poop
    return [GridEntityXMLType.POOP_RED, 0, 0];
  }

  return undefined;
});

// Suit Baby
preRoomEntitySpawnBabyFunctionMap.set(287, (_entityType: EntityType) => {
  // All special rooms are Devil Rooms
  // Ignore some select special rooms
  const roomType = g.r.GetType();
  if (
    roomType !== RoomType.ROOM_DEFAULT && // 1
    roomType !== RoomType.ROOM_ERROR && // 3
    roomType !== RoomType.ROOM_BOSS && // 5
    roomType !== RoomType.ROOM_DEVIL && // 14
    roomType !== RoomType.ROOM_ANGEL && // 15
    roomType !== RoomType.ROOM_DUNGEON && // 16
    roomType !== RoomType.ROOM_BOSSRUSH && // 17
    roomType !== RoomType.ROOM_BLACK_MARKET // 22
  ) {
    return [999, 0, 0]; // Equal to 1000.0, which is a blank effect, which is essentially nothing
  }

  return undefined;
});

// Red Wrestler Baby
preRoomEntitySpawnBabyFunctionMap.set(389, (entityType: int) => {
  if (
    g.r.IsFirstVisit() &&
    entityType >= 1000 && // We only care about grid entities
    !GRID_ENTITY_REPLACEMENT_EXCEPTIONS.has(entityType) // Make an exception for certain entities
  ) {
    // Everything is TNT
    return [GridEntityXMLType.TNT, 0, 0];
  }

  return undefined;
});
