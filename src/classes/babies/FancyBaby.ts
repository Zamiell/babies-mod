import type { CollectibleType } from "isaac-typescript-definitions";
import {
  EntityType,
  ItemType,
  ModCallback,
  PickupVariant,
  RoomType,
} from "isaac-typescript-definitions";
import type { PickingUpItemCollectible } from "isaacscript-common";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  ReadonlyMap,
  assertDefined,
  dequeueItem,
  doesEntityExist,
  game,
  getRoomGridIndexesForType,
  getRooms,
  gridCoordinatesToWorldPosition,
  inStartingRoom,
  isEven,
  log,
  teleport,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { mod } from "../../mod";
import { isRerolledCollectibleBuggedHeart } from "../../utils";
import { Baby } from "../Baby";

enum TeleportPrice {
  TEN = 10,
  FIFTEEN = 15,
  TWENTY = 20,
}

const TELEPORT_COLLECTIBLE_TYPE_TO_ROOM_TYPE_MAP = new ReadonlyMap<
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

const TELEPORT_ROOM_TYPE_TO_ITEM_AND_PRICE_MAP = new ReadonlyMap<
  RoomType,
  readonly [CollectibleType, TeleportPrice]
>([
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

const COLLECTIBLE_POSITIONS = [
  [3, 1],
  [9, 1],
  [3, 5],
  [9, 5],
  [1, 1],
  [11, 1],
  [1, 5],
  [11, 5],
] as const;

const CHEAPEST_TELEPORT_PRICE = TeleportPrice.TEN;

/** Can purchase teleports to special rooms. */
export class FancyBaby extends Baby {
  /**
   * We want to ensure that the starting room of the floor is clean (e.g. no Blue Womb, no The
   * Chest, etc.)
   */
  override isValid(player: EntityPlayer): boolean {
    const coins = player.GetNumCoins();
    return (
      coins >= CHEAPEST_TELEPORT_PRICE && !doesEntityExist(EntityType.PICKUP)
    );
  }

  /** Delete the rerolled teleport collectibles. */
  // 35
  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.HEART)
  postPickupUpdateHeart(pickup: EntityPickup): void {
    if (isRerolledCollectibleBuggedHeart(pickup) && inStartingRoom()) {
      pickup.Remove();
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const level = game.GetLevel();
    const stage = level.GetStage();
    const room = game.GetRoom();
    const isFirstVisit = room.IsFirstVisit();

    if (!inStartingRoom() || !isFirstVisit) {
      return;
    }

    // Can purchase teleports to special rooms.
    let positionIndex = -1;

    // Find the special rooms on the floor.
    for (const roomDescriptor of getRooms()) {
      const roomData = roomDescriptor.Data;
      if (roomData === undefined) {
        continue;
      }

      const roomType = roomData.Type;
      const itemAndPrice =
        TELEPORT_ROOM_TYPE_TO_ITEM_AND_PRICE_MAP.get(roomType);
      if (itemAndPrice === undefined) {
        // This is not a special room.
        continue;
      }

      let collectibleType = itemAndPrice[0];
      const price = itemAndPrice[1];

      if (
        collectibleType === CollectibleTypeCustom.CHALLENGE_ROOM_TELEPORT &&
        isEven(stage)
      ) {
        collectibleType = CollectibleTypeCustom.BOSS_CHALLENGE_ROOM_TELEPORT;
      }

      positionIndex++;
      if (positionIndex > COLLECTIBLE_POSITIONS.length) {
        log("Error: This floor has too many special rooms for Fancy Baby.");
        return;
      }

      const xy = COLLECTIBLE_POSITIONS[positionIndex];
      assertDefined(
        xy,
        `Failed to get the floor position for index: ${positionIndex}`,
      );

      const [x, y] = xy;
      const position = gridCoordinatesToWorldPosition(x, y);
      // The teleport collectibles do not need a unique seed.
      const collectible = mod.spawnCollectible(collectibleType, position);
      collectible.AutoUpdatePrice = false;
      collectible.Price = price;
    }
  }

  @CallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP, ItemType.PASSIVE)
  preItemPickupPassive(
    player: EntityPlayer,
    pickingUpItem: PickingUpItemCollectible,
  ): void {
    const teleportRoomType = TELEPORT_COLLECTIBLE_TYPE_TO_ROOM_TYPE_MAP.get(
      pickingUpItem.subType,
    );
    if (teleportRoomType === undefined) {
      return;
    }

    dequeueItem(player);

    const roomGridIndexes = getRoomGridIndexesForType(teleportRoomType);
    const firstRoomGridIndex = roomGridIndexes[0];
    if (firstRoomGridIndex !== undefined) {
      teleport(firstRoomGridIndex);
    }
  }
}
