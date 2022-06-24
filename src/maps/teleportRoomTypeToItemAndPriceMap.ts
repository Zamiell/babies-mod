import { CollectibleType, RoomType } from "isaac-typescript-definitions";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";

enum TeleportPrice {
  TEN = 10,
  FIFTEEN = 15,
  TWENTY = 20,
}

export const TELEPORT_ROOM_TYPE_TO_ITEM_AND_PRICE_MAP: ReadonlyMap<
  RoomType,
  [CollectibleType, TeleportPrice]
> = new Map([
  // 2
  [RoomType.SHOP, [CollectibleTypeCustom.SHOP_TELEPORT, TeleportPrice.TEN]],

  // 4
  [
    RoomType.TREASURE,
    [CollectibleTypeCustom.TREASURE_ROOM_TELEPORT, TeleportPrice.TEN],
  ],

  // 6
  [
    RoomType.MINI_BOSS,
    [CollectibleTypeCustom.MINIBOSS_ROOM_TELEPORT, TeleportPrice.TEN],
  ],

  // 9
  [RoomType.ARCADE, [CollectibleTypeCustom.ARCADE_TELEPORT, TeleportPrice.TEN]],

  // 10
  [
    RoomType.CURSE,
    [CollectibleTypeCustom.CURSE_ROOM_TELEPORT, TeleportPrice.TEN],
  ],

  // 11
  [
    RoomType.CHALLENGE,
    [CollectibleTypeCustom.CHALLENGE_ROOM_TELEPORT, TeleportPrice.TEN],
  ],

  // 12
  [
    RoomType.LIBRARY,
    [CollectibleTypeCustom.LIBRARY_TELEPORT, TeleportPrice.FIFTEEN],
  ],

  // 13
  [
    RoomType.SACRIFICE,
    [CollectibleTypeCustom.SACRIFICE_ROOM_TELEPORT, TeleportPrice.TEN],
  ],

  // 18
  [
    RoomType.CLEAN_BEDROOM,
    [CollectibleTypeCustom.BEDROOM_CLEAN_TELEPORT, TeleportPrice.TEN],
  ],

  // 19
  [
    RoomType.DIRTY_BEDROOM,
    [CollectibleTypeCustom.BEDROOM_DIRTY_TELEPORT, TeleportPrice.TWENTY],
  ],

  // 20
  [
    RoomType.CHEST,
    [CollectibleTypeCustom.TREASURE_CHEST_ROOM_TELEPORT, TeleportPrice.TEN],
  ],

  // 21
  [
    RoomType.DICE,
    [CollectibleTypeCustom.DICE_ROOM_TELEPORT, TeleportPrice.TEN],
  ],

  // 24
  [
    RoomType.PLANETARIUM,
    [CollectibleTypeCustom.PLANETARIUM_TELEPORT, TeleportPrice.TEN],
  ],
]);
