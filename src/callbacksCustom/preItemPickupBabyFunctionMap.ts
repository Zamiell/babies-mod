import {
  getRoomGridIndexesForType,
  isQuestCollectible,
  PickingUpItem,
  teleport,
} from "isaacscript-common";
import { TELEPORT_COLLECTIBLE_TYPE_TO_ROOM_TYPE_MAP } from "../maps/teleportCollectibleTypeToRoomTypeMap";

export const preItemPickupBabyFunctionMap = new Map<
  int,
  (player: EntityPlayer, pickingUpItem: PickingUpItem) => void
>();

// Fancy Baby
preItemPickupBabyFunctionMap.set(
  216,
  (player: EntityPlayer, pickingUpItem: PickingUpItem) => {
    if (pickingUpItem.type !== ItemType.ITEM_PASSIVE) {
      return;
    }

    // Can purchase teleports to special rooms
    const teleportRoomType = TELEPORT_COLLECTIBLE_TYPE_TO_ROOM_TYPE_MAP.get(
      pickingUpItem.id,
    );
    if (teleportRoomType === undefined) {
      return;
    }

    const roomGridIndexes = getRoomGridIndexesForType(teleportRoomType);
    if (roomGridIndexes.length > 0) {
      const firstRoomGridIndex = roomGridIndexes[0];
      teleport(firstRoomGridIndex);
    }
  },
);

// Corrupted Baby
preItemPickupBabyFunctionMap.set(
  307,
  (player: EntityPlayer, pickingUpItem: PickingUpItem) => {
    if (
      (pickingUpItem.type === ItemType.ITEM_PASSIVE ||
        pickingUpItem.type === ItemType.ITEM_ACTIVE ||
        pickingUpItem.type === ItemType.ITEM_FAMILIAR) &&
      isQuestCollectible(pickingUpItem.id)
    ) {
      return;
    }

    // Taking items/pickups causes damage (1/2)
    player.TakeDamage(1, 0, EntityRef(player), 0);
  },
);
