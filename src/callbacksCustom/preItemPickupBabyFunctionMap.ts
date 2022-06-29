import { DamageFlagZero, ItemType } from "isaac-typescript-definitions";
import {
  getRoomGridIndexesForType,
  isQuestCollectible,
  PickingUpItem,
  teleport,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { TELEPORT_COLLECTIBLE_TYPE_TO_ROOM_TYPE_MAP } from "../maps/teleportCollectibleTypeToRoomTypeMap";

export const preItemPickupBabyFunctionMap = new Map<
  RandomBabyType,
  (player: EntityPlayer, pickingUpItem: PickingUpItem) => void
>();

// 216
preItemPickupBabyFunctionMap.set(
  RandomBabyType.FANCY,
  (_player: EntityPlayer, pickingUpItem: PickingUpItem) => {
    if (pickingUpItem.itemType !== ItemType.PASSIVE) {
      return;
    }

    // Can purchase teleports to special rooms.
    const teleportRoomType = TELEPORT_COLLECTIBLE_TYPE_TO_ROOM_TYPE_MAP.get(
      pickingUpItem.subType,
    );
    if (teleportRoomType === undefined) {
      return;
    }

    const roomGridIndexes = getRoomGridIndexesForType(teleportRoomType);
    const firstRoomGridIndex = roomGridIndexes[0];
    if (firstRoomGridIndex !== undefined) {
      teleport(firstRoomGridIndex);
    }
  },
);

// 307
preItemPickupBabyFunctionMap.set(
  RandomBabyType.CORRUPTED,
  (player: EntityPlayer, pickingUpItem: PickingUpItem) => {
    if (
      (pickingUpItem.itemType === ItemType.PASSIVE ||
        pickingUpItem.itemType === ItemType.ACTIVE ||
        pickingUpItem.itemType === ItemType.FAMILIAR) &&
      isQuestCollectible(pickingUpItem.subType)
    ) {
      return;
    }

    // Taking items/pickups causes damage (1/2).
    player.TakeDamage(1, DamageFlagZero, EntityRef(player), 0);
  },
);
