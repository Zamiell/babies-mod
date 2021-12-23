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
    if (pickingUpItem.type !== ItemType.ITEM_PASSIVE) {
      return;
    }

    const teleportRoomType = TELEPORT_COLLECTIBLE_TYPE_TO_ROOM_TYPE_MAP.get(
      pickingUpItem.id,
    );
    if (teleportRoomType !== undefined) {
      player.RemoveCollectible(pickingUpItem.id);
      removeCollectibleFromItemTracker(pickingUpItem.id);
    }
  },
);
