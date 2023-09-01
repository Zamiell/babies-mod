import { LevelStage, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  getRoomGridIndexesForType,
  onStage,
  teleport,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Secret Room --> Super Secret Room. */
export class VikingBaby extends Baby {
  /** Removing floors with no Secret Rooms. */
  override isValid(): boolean {
    return !onStage(LevelStage.HOME) && !onStage(LevelStage.BLUE_WOMB);
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, RoomType.SECRET)
  postNewRoomReordered(): void {
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
