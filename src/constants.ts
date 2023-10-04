import {
  EntityType,
  GridEntityXMLType,
  PickupVariant,
  PlayerForm,
  RoomType,
  SwingerVariant,
} from "isaac-typescript-definitions";
import { ReadonlySet, getHighestEnumValue } from "isaacscript-common";
import { RandomBabyType } from "./enums/RandomBabyType";

export const MOD_NAME = "The Babies Mod";

/** The version is updated automatically by IsaacScript. */
export const VERSION = "1.25.14";

export const IS_DEV = false as boolean;

export const MAX_BABY_TYPE = getHighestEnumValue(RandomBabyType);

export const FADED_BLUE = Color(0, 0, 1, 0.7);
export const FADED_RED = Color(1, 0, 0, 0.7);
export const FADED_YELLOW = Color(1, 1, 0, 0.7);

export const ROOM_TYPES_TO_NOT_TRANSFORM = new ReadonlySet<RoomType>([
  RoomType.DEFAULT, // 1
  // I AM ERROR rooms should not be converted so that they have a way to escape.
  RoomType.ERROR, // 3
  RoomType.BOSS, // 5
  // Devil Rooms and Angel Rooms should not be converted since they are outside of the gird.
  RoomType.DEVIL, // 14
  RoomType.ANGEL, // 15
  // Dungeons cannot be converted because they need to have the ladder.
  RoomType.DUNGEON, // 16
  // Big rooms should not be converted.
  RoomType.BOSS_RUSH, // 17
  RoomType.BLACK_MARKET, // 22
  // The mechanic should not interfere with progressing in Greed Mode.
  RoomType.GREED_EXIT, // 23
  // The mechanic should not interfere with getting to Repentance floors.
  RoomType.SECRET_EXIT, // 27
  // The mechanic should not apply to in-between battle rooms.
  RoomType.BLUE, // 28
]);

export const PICKUP_VARIANTS_IMMUNE_TO_BABY_EFFECTS =
  new ReadonlySet<PickupVariant>([
    PickupVariant.COLLECTIBLE, // 100
    PickupVariant.SHOP_ITEM, // 150
    PickupVariant.BIG_CHEST, // 340
    PickupVariant.TROPHY, // 370
    PickupVariant.BED, // 380
  ]);

export const GRID_ENTITY_REPLACEMENT_EXCEPTIONS =
  new ReadonlySet<GridEntityXMLType>([
    GridEntityXMLType.PRESSURE_PLATE,
    GridEntityXMLType.TRAPDOOR,
    GridEntityXMLType.CRAWL_SPACE,
  ]);

export const BAD_MISSED_TEARS_TRANSFORMATIONS = [
  PlayerForm.CONJOINED, // 7
  PlayerForm.BOOKWORM, // 10
] as const;

export const GOING_TO_NEXT_FLOOR_ANIMATIONS = new ReadonlySet<string>([
  "Trapdoor",
  "TrapdoorCustom",
  "LightTravel",
  "LightTravelCustom",
]);

/** From Racing+. */
export const MULTI_SEGMENT_BOSSES = new ReadonlySet<EntityType>([
  EntityType.LARRY_JR, // 19 (and The Hollow / Tuff Twins / The Shell)
  EntityType.PIN, // 62 (and Scolex / Frail / Wormwood)
  EntityType.GEMINI, // 79 (and Steven / Blighted Ovum)
  EntityType.HEART_OF_INFAMY, // 98
  EntityType.TURDLET, // 918
]);

/** Doubling certain entities leads to bugs. */
export const BUGGY_REPLACING_OR_DOUBLING_ENTITY_TYPES_SET =
  new ReadonlySet<EntityType>([
    EntityType.SHOPKEEPER, // 17
    EntityType.FIREPLACE, // 33
    EntityType.GRIMACE, // 42
    EntityType.POKY, // 44
    EntityType.ETERNAL_FLY, // 96
    EntityType.CONSTANT_STONE_SHOOTER, // 202
    EntityType.BRIMSTONE_HEAD, // 203
    EntityType.WALL_HUGGER, // 218
    EntityType.GAPING_MAW, // 235
    EntityType.BROKEN_GAPING_MAW, // 236
    EntityType.SWARM, // 281
    EntityType.PITFALL, // 291
  ]);

/** Doubling certain entity + variant combinations leads to bugs. */
export const BUGGY_REPLACING_OR_DOUBLING_ENTITY_TYPE_VARIANT_SET =
  new ReadonlySet<string>([
    `${EntityType.SWINGER}.${SwingerVariant.SWINGER_HEAD}`, // 216.1
    `${EntityType.SWINGER}.${SwingerVariant.SWINGER_NECK}`, // 216.10
  ]);
