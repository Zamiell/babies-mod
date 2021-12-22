import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";

enum TeleportPrice {
  TEN = 10,
  FIFTEEN = 15,
  TWENTY = 20,
}

export const TELEPORT_ROOM_TYPE_TO_ITEM_AND_PRICE_MAP = new Map([
  [
    RoomType.ROOM_SHOP,
    [CollectibleTypeCustom.COLLECTIBLE_SHOP_TELEPORT, TeleportPrice.TEN],
  ], // 2
  [
    RoomType.ROOM_TREASURE,
    [
      CollectibleTypeCustom.COLLECTIBLE_TREASURE_ROOM_TELEPORT,
      TeleportPrice.TEN,
    ],
  ], // 4
  [
    RoomType.ROOM_MINIBOSS,
    [
      CollectibleTypeCustom.COLLECTIBLE_MINIBOSS_ROOM_TELEPORT,
      TeleportPrice.TEN,
    ],
  ], // 6
  [
    RoomType.ROOM_ARCADE,
    [CollectibleTypeCustom.COLLECTIBLE_ARCADE_TELEPORT, TeleportPrice.TEN],
  ], // 9
  [
    RoomType.ROOM_CURSE,
    [CollectibleTypeCustom.COLLECTIBLE_CURSE_ROOM_TELEPORT, TeleportPrice.TEN],
  ], // 10
  [
    RoomType.ROOM_CHALLENGE,
    [
      CollectibleTypeCustom.COLLECTIBLE_CHALLENGE_ROOM_TELEPORT,
      TeleportPrice.TEN,
    ],
  ], // 11
  [
    RoomType.ROOM_LIBRARY,
    [CollectibleTypeCustom.COLLECTIBLE_LIBRARY_TELEPORT, TeleportPrice.FIFTEEN],
  ], // 12
  [
    RoomType.ROOM_SACRIFICE,
    [
      CollectibleTypeCustom.COLLECTIBLE_SACRIFICE_ROOM_TELEPORT,
      TeleportPrice.TEN,
    ],
  ], // 13
  [
    RoomType.ROOM_ISAACS,
    [
      CollectibleTypeCustom.COLLECTIBLE_BEDROOM_CLEAN_TELEPORT,
      TeleportPrice.TEN,
    ],
  ], // 18
  [
    RoomType.ROOM_BARREN,
    [
      CollectibleTypeCustom.COLLECTIBLE_BEDROOM_DIRTY_TELEPORT,
      TeleportPrice.TWENTY,
    ],
  ], // 19
  [
    RoomType.ROOM_CHEST,
    [
      CollectibleTypeCustom.COLLECTIBLE_TREASURE_CHEST_ROOM_TELEPORT,
      TeleportPrice.TEN,
    ],
  ], // 20
  [
    RoomType.ROOM_DICE,
    [CollectibleTypeCustom.COLLECTIBLE_DICE_ROOM_TELEPORT, TeleportPrice.TEN],
  ], // 21
]);
