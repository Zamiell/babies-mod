import {
  ItemType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import type { PickingUpItemCollectible } from "isaacscript-common";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  assertDefined,
  dequeueItem,
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
import { TELEPORT_COLLECTIBLE_TYPE_TO_ROOM_TYPE_MAP } from "../../maps/teleportCollectibleTypeToRoomTypeMap";
import { TELEPORT_ROOM_TYPE_TO_ITEM_AND_PRICE_MAP } from "../../maps/teleportRoomTypeToItemAndPriceMap";
import { mod } from "../../mod";
import { isRerolledCollectibleBuggedHeart } from "../../utils";
import { Baby } from "../Baby";

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

/** Can purchase teleports to special rooms. */
export class FancyBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    const coins = player.GetNumCoins();
    return coins >= 10;
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
