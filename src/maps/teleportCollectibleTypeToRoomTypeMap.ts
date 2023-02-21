import { CollectibleType, RoomType } from "isaac-typescript-definitions";
import { ReadonlyMap } from "isaacscript-common";
import { CollectibleTypeCustom } from "../enums/CollectibleTypeCustom";

export const TELEPORT_COLLECTIBLE_TYPE_TO_ROOM_TYPE_MAP = new ReadonlyMap<
  CollectibleType,
  RoomType
>([
  [CollectibleTypeCustom.SHOP_TELEPORT, RoomType.SHOP], // 2
  [CollectibleTypeCustom.TREASURE_ROOM_TELEPORT, RoomType.TREASURE], // 4
  [CollectibleTypeCustom.MINIBOSS_ROOM_TELEPORT, RoomType.MINI_BOSS], // 6
  [CollectibleTypeCustom.ARCADE_TELEPORT, RoomType.ARCADE], // 9
  [CollectibleTypeCustom.CURSE_ROOM_TELEPORT, RoomType.CURSE], // 10
  [CollectibleTypeCustom.CHALLENGE_ROOM_TELEPORT, RoomType.CHALLENGE], // 11
  [CollectibleTypeCustom.BOSS_CHALLENGE_ROOM_TELEPORT, RoomType.CHALLENGE], // 11
  [CollectibleTypeCustom.LIBRARY_TELEPORT, RoomType.LIBRARY], // 12
  [CollectibleTypeCustom.SACRIFICE_ROOM_TELEPORT, RoomType.SACRIFICE], // 13
  [CollectibleTypeCustom.BEDROOM_CLEAN_TELEPORT, RoomType.CLEAN_BEDROOM], // 18
  [CollectibleTypeCustom.BEDROOM_DIRTY_TELEPORT, RoomType.DIRTY_BEDROOM], // 19
  [CollectibleTypeCustom.TREASURE_CHEST_ROOM_TELEPORT, RoomType.CHEST], // 20
  [CollectibleTypeCustom.DICE_ROOM_TELEPORT, RoomType.DICE], // 21
  [CollectibleTypeCustom.PLANETARIUM_TELEPORT, RoomType.PLANETARIUM], // 24
]);
