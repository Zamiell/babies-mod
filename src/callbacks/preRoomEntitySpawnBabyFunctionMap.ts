import { EntityType, GridEntityXMLType } from "isaac-typescript-definitions";
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";
import { shouldTransformRoomType } from "../utils";

const GRID_ENTITY_REPLACEMENT_EXCEPTIONS: ReadonlySet<GridEntityXMLType> =
  new Set([
    GridEntityXMLType.PRESSURE_PLATE,
    GridEntityXMLType.TRAPDOOR,
    GridEntityXMLType.CRAWL_SPACE,
  ]);

export const preRoomEntitySpawnBabyFunctionMap = new Map<
  RandomBabyType,
  (
    entityType: EntityType | GridEntityXMLType,
  ) => [EntityType | GridEntityXMLType, int, int] | undefined
>();

// 143
preRoomEntitySpawnBabyFunctionMap.set(
  RandomBabyType.CHOMPERS,
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

// 158
preRoomEntitySpawnBabyFunctionMap.set(
  RandomBabyType.PRETTY,
  (_entityType: EntityType | GridEntityXMLType) => {
    const roomType = g.r.GetType();

    // All special rooms are Angel Shops. Ignore some select special rooms.
    if (shouldTransformRoomType(roomType)) {
      return [999, 0, 0]; // Equal to 1000.0, which is a blank effect, which is essentially nothing.
    }

    return undefined;
  },
);

// 287
preRoomEntitySpawnBabyFunctionMap.set(
  RandomBabyType.SUIT,
  (_entityType: EntityType | GridEntityXMLType) => {
    const roomType = g.r.GetType();

    // All special rooms are Devil Rooms. Ignore some select special rooms.
    if (shouldTransformRoomType(roomType)) {
      return [999, 0, 0]; // Equal to 1000.0, which is a blank effect, which is essentially nothing.
    }

    return undefined;
  },
);

// 389
preRoomEntitySpawnBabyFunctionMap.set(
  RandomBabyType.RED_WRESTLER,
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
