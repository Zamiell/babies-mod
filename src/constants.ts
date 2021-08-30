import { CollectibleTypeCustom } from "./types/enums";

// The version is updated automatically by IsaacScript
export const VERSION = "1.2.2";

export const ZERO_VECTOR = Vector(0, 0);
export const DEFAULT_KCOLOR = KColor(1, 1, 1, 1);

/*
export const TELEPORT_TO_ROOM_TYPE_MAP = new LuaTable([
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
*/

export const TELEPORT_TO_ROOM_TYPE_MAP = new LuaTable();
TELEPORT_TO_ROOM_TYPE_MAP.set(
  CollectibleTypeCustom.COLLECTIBLE_SHOP_TELEPORT,
  RoomType.ROOM_SHOP,
);
TELEPORT_TO_ROOM_TYPE_MAP.set(
  CollectibleTypeCustom.COLLECTIBLE_TREASURE_ROOM_TELEPORT,
  RoomType.ROOM_TREASURE,
);

TELEPORT_TO_ROOM_TYPE_MAP.set(
  CollectibleTypeCustom.COLLECTIBLE_MINIBOSS_ROOM_TELEPORT,
  RoomType.ROOM_MINIBOSS,
);
TELEPORT_TO_ROOM_TYPE_MAP.set(
  CollectibleTypeCustom.COLLECTIBLE_ARCADE_TELEPORT,
  RoomType.ROOM_ARCADE,
);
TELEPORT_TO_ROOM_TYPE_MAP.set(
  CollectibleTypeCustom.COLLECTIBLE_CURSE_ROOM_TELEPORT,
  RoomType.ROOM_CURSE,
);
TELEPORT_TO_ROOM_TYPE_MAP.set(
  CollectibleTypeCustom.COLLECTIBLE_CHALLENGE_ROOM_TELEPORT,
  RoomType.ROOM_CHALLENGE,
);
TELEPORT_TO_ROOM_TYPE_MAP.set(
  CollectibleTypeCustom.COLLECTIBLE_LIBRARY_TELEPORT,
  RoomType.ROOM_LIBRARY,
);
TELEPORT_TO_ROOM_TYPE_MAP.set(
  CollectibleTypeCustom.COLLECTIBLE_SACRIFICE_ROOM_TELEPORT,
  RoomType.ROOM_SACRIFICE,
);
TELEPORT_TO_ROOM_TYPE_MAP.set(
  CollectibleTypeCustom.COLLECTIBLE_BEDROOM_CLEAN_TELEPORT,
  RoomType.ROOM_ISAACS,
);
TELEPORT_TO_ROOM_TYPE_MAP.set(
  CollectibleTypeCustom.COLLECTIBLE_BEDROOM_DIRTY_TELEPORT,
  RoomType.ROOM_BARREN,
);
TELEPORT_TO_ROOM_TYPE_MAP.set(
  CollectibleTypeCustom.COLLECTIBLE_TREASURE_CHEST_ROOM_TELEPORT,
  RoomType.ROOM_CHEST,
);
TELEPORT_TO_ROOM_TYPE_MAP.set(
  CollectibleTypeCustom.COLLECTIBLE_DICE_ROOM_TELEPORT,
  RoomType.ROOM_DICE,
);
