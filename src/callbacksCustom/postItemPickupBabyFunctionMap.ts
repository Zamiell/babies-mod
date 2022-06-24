import { ItemType } from "isaac-typescript-definitions";
import {
  PickingUpItem,
  removeCollectibleFromItemTracker,
} from "isaacscript-common";
import { TELEPORT_COLLECTIBLE_TYPE_TO_ROOM_TYPE_MAP } from "../maps/teleportCollectibleTypeToRoomTypeMap";

export const postItemPickupBabyFunctionMap = new Map<
  int,
  (player: EntityPlayer, pickingUpItem: PickingUpItem) => void
>();

// Fancy Baby
postItemPickupBabyFunctionMap.set(
  216,
  (player: EntityPlayer, pickingUpItem: PickingUpItem) => {
    if (pickingUpItem.itemType !== ItemType.PASSIVE) {
      return;
    }

    const teleportRoomType = TELEPORT_COLLECTIBLE_TYPE_TO_ROOM_TYPE_MAP.get(
      pickingUpItem.subType,
    );
    if (teleportRoomType !== undefined) {
      player.RemoveCollectible(pickingUpItem.subType);
      removeCollectibleFromItemTracker(pickingUpItem.subType);
    }
  },
);
