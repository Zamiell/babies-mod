import { CollectibleTypeCustom } from "./types/enums";

// The version is updated automatically by IsaacScript
export const VERSION = "1.2.1";

export const R7_SEASON_5 = "R+7 (Season 5)";
export const ZERO_VECTOR = Vector(0, 0);
export const DEFAULT_KCOLOR = KColor(1, 1, 1, 1);

export const TELEPORT_TO_ROOM_TYPE_MAP = new Map([
  [CollectibleTypeCustom.COLLECTIBLE_SHOP_TELEPORT, RoomType.ROOM_SHOP],
  [
    CollectibleTypeCustom.COLLECTIBLE_TREASURE_ROOM_TELEPORT,
    RoomType.ROOM_TREASURE,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_MINIBOSS_ROOM_TELEPORT,
    RoomType.ROOM_MINIBOSS,
  ],
  [CollectibleTypeCustom.COLLECTIBLE_ARCADE_TELEPORT, RoomType.ROOM_ARCADE],
  [CollectibleTypeCustom.COLLECTIBLE_CURSE_ROOM_TELEPORT, RoomType.ROOM_CURSE],
  [
    CollectibleTypeCustom.COLLECTIBLE_CHALLENGE_ROOM_TELEPORT,
    RoomType.ROOM_CHALLENGE,
  ],
  [CollectibleTypeCustom.COLLECTIBLE_LIBRARY_TELEPORT, RoomType.ROOM_LIBRARY],
  [
    CollectibleTypeCustom.COLLECTIBLE_SACRIFICE_ROOM_TELEPORT,
    RoomType.ROOM_SACRIFICE,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_BEDROOM_CLEAN_TELEPORT,
    RoomType.ROOM_ISAACS,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_BEDROOM_DIRTY_TELEPORT,
    RoomType.ROOM_BARREN,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_TREASURE_CHEST_ROOM_TELEPORT,
    RoomType.ROOM_CHEST,
  ],
  [CollectibleTypeCustom.COLLECTIBLE_DICE_ROOM_TELEPORT, RoomType.ROOM_DICE],
]);
