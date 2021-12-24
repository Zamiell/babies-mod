import g from "../globals";
import { shouldTransformRoomType } from "../util";

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

// Pretty Baby
preRoomEntitySpawnBabyFunctionMap.set(158, (_entityType: EntityType) => {
  const roomType = g.r.GetType();

  // All special rooms are Angel Shops
  // Ignore some select special rooms
  if (shouldTransformRoomType(roomType)) {
    return [999, 0, 0]; // Equal to 1000.0, which is a blank effect, which is essentially nothing
  }

  return undefined;
});

// Suit Baby
preRoomEntitySpawnBabyFunctionMap.set(287, (_entityType: EntityType) => {
  const roomType = g.r.GetType();

  // All special rooms are Devil Rooms
  // Ignore some select special rooms
  if (shouldTransformRoomType(roomType)) {
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
