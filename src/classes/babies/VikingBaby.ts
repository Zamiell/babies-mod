import { RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getRoomGridIndexesForType,
  ModCallbackCustom,
  teleport,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Secret Room --> Super Secret Room. */
export class VikingBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const roomType = g.r.GetType();

    if (roomType !== RoomType.SECRET) {
      return;
    }

    const superSecretRoomIndexes = getRoomGridIndexesForType(
      RoomType.SUPER_SECRET,
    );
    if (superSecretRoomIndexes.length === 0) {
      return;
    }
    const firstSuperSecretRoomIndex = superSecretRoomIndexes[0];
    if (firstSuperSecretRoomIndex !== undefined) {
      teleport(firstSuperSecretRoomIndex);
    }
  }
}
