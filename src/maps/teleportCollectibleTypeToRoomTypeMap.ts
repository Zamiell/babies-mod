import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";

export const TELEPORT_COLLECTIBLE_TYPE_TO_ROOM_TYPE_MAP: ReadonlyMap<
  CollectibleTypeCustom,
  RoomType
> = new Map([
  [CollectibleTypeCustom.COLLECTIBLE_SHOP_TELEPORT, RoomType.ROOM_SHOP], // 2
  [
    CollectibleTypeCustom.COLLECTIBLE_TREASURE_ROOM_TELEPORT,
    RoomType.ROOM_TREASURE,
  ], // 4
  [
    CollectibleTypeCustom.COLLECTIBLE_MINIBOSS_ROOM_TELEPORT,
    RoomType.ROOM_MINIBOSS,
  ], // 6
  [CollectibleTypeCustom.COLLECTIBLE_ARCADE_TELEPORT, RoomType.ROOM_ARCADE], // 9
  [CollectibleTypeCustom.COLLECTIBLE_CURSE_ROOM_TELEPORT, RoomType.ROOM_CURSE], // 10
  [
    CollectibleTypeCustom.COLLECTIBLE_CHALLENGE_ROOM_TELEPORT,
    RoomType.ROOM_CHALLENGE,
  ], // 11
  [
    CollectibleTypeCustom.COLLECTIBLE_BOSS_CHALLENGE_ROOM_TELEPORT,
    RoomType.ROOM_CHALLENGE,
  ], // 11
  [CollectibleTypeCustom.COLLECTIBLE_LIBRARY_TELEPORT, RoomType.ROOM_LIBRARY], // 12
  [
    CollectibleTypeCustom.COLLECTIBLE_SACRIFICE_ROOM_TELEPORT,
    RoomType.ROOM_SACRIFICE,
  ], // 13
  [
    CollectibleTypeCustom.COLLECTIBLE_BEDROOM_CLEAN_TELEPORT,
    RoomType.ROOM_ISAACS,
  ], // 18
  [
    CollectibleTypeCustom.COLLECTIBLE_BEDROOM_DIRTY_TELEPORT,
    RoomType.ROOM_BARREN,
  ], // 19
  [
    CollectibleTypeCustom.COLLECTIBLE_TREASURE_CHEST_ROOM_TELEPORT,
    RoomType.ROOM_CHEST,
  ], // 20
  [CollectibleTypeCustom.COLLECTIBLE_DICE_ROOM_TELEPORT, RoomType.ROOM_DICE], // 21
  [
    CollectibleTypeCustom.COLLECTIBLE_PLANETARIUM_TELEPORT,
    RoomType.ROOM_PLANETARIUM,
  ], // 24
]);
