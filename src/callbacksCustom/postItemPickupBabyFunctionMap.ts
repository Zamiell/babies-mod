import { ItemType } from "isaac-typescript-definitions";
import {
  PickingUpItem,
  removeCollectibleFromItemTracker,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { TELEPORT_COLLECTIBLE_TYPE_TO_ROOM_TYPE_MAP } from "../maps/teleportCollectibleTypeToRoomTypeMap";

export const postItemPickupBabyFunctionMap = new Map<
  RandomBabyType,
  (player: EntityPlayer, pickingUpItem: PickingUpItem) => void
>();

// 216
postItemPickupBabyFunctionMap.set(
  RandomBabyType.FANCY,
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
