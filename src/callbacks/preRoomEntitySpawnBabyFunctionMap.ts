import { EntityType, GridEntityXMLType } from "isaac-typescript-definitions";
import g from "../globals";
import { shouldTransformRoomType } from "../utils";

const GRID_ENTITY_REPLACEMENT_EXCEPTIONS: ReadonlySet<GridEntityXMLType> =
  new Set([
    GridEntityXMLType.PRESSURE_PLATE,
    GridEntityXMLType.TRAPDOOR,
    GridEntityXMLType.CRAWL_SPACE,
  ]);

export const preRoomEntitySpawnBabyFunctionMap = new Map<
  int,
  (
    entityType: EntityType | GridEntityXMLType,
  ) => [EntityType | GridEntityXMLType, int, int] | undefined
>();

// Chompers Baby
preRoomEntitySpawnBabyFunctionMap.set(
  143,
  (entityType: EntityType | GridEntityXMLType) => {
    if (
      g.r.IsFirstVisit() &&
      (entityType as int) >= 1000 && // We only care about grid entities.
      !GRID_ENTITY_REPLACEMENT_EXCEPTIONS.has(
        entityType as unknown as GridEntityXMLType,
      )
    ) {
      // Everything is Red Poop.
      return [GridEntityXMLType.POOP_RED, 0, 0];
    }

    return undefined;
  },
);

// Pretty Baby
preRoomEntitySpawnBabyFunctionMap.set(
  158,
  (_entityType: EntityType | GridEntityXMLType) => {
    const roomType = g.r.GetType();

    // All special rooms are Angel Shops. Ignore some select special rooms.
    if (shouldTransformRoomType(roomType)) {
      return [999, 0, 0]; // Equal to 1000.0, which is a blank effect, which is essentially nothing.
    }

    return undefined;
  },
);

// Suit Baby
preRoomEntitySpawnBabyFunctionMap.set(
  287,
  (_entityType: EntityType | GridEntityXMLType) => {
    const roomType = g.r.GetType();

    // All special rooms are Devil Rooms. Ignore some select special rooms.
    if (shouldTransformRoomType(roomType)) {
      return [999, 0, 0]; // Equal to 1000.0, which is a blank effect, which is essentially nothing.
    }

    return undefined;
  },
);

// Red Wrestler Baby
preRoomEntitySpawnBabyFunctionMap.set(
  389,
  (entityType: EntityType | GridEntityXMLType) => {
    if (
      g.r.IsFirstVisit() &&
      (entityType as int) >= 1000 && // We only care about grid entities
      !GRID_ENTITY_REPLACEMENT_EXCEPTIONS.has(
        entityType as unknown as GridEntityXMLType,
      )
    ) {
      // Everything is TNT
      return [GridEntityXMLType.TNT, 0, 0];
    }

    return undefined;
  },
);
