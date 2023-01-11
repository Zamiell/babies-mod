import { ModCallback, RoomType } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  getDoors,
  ModCallbackCustom,
} from "isaacscript-common";
import { RandomBabyType } from "../../enums/RandomBabyType";
import { g } from "../../globals";
import { pseudoRoomClearPostUpdate } from "../../pseudoRoomClear";
import { Baby } from "../Baby";

/** Locked doors in uncleared rooms. */
export class NerdBaby extends Baby {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    pseudoRoomClearPostUpdate(RandomBabyType.NERD);
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (!g.r.IsClear()) {
      return;
    }

    // Locked doors in uncleared rooms. If the player leaves and re-enters an uncleared room, a
    // normal door will stay locked. So, unlock all normal doors if the room is already clear.
    const normalLookingDoors = getDoors(
      RoomType.DEFAULT, // 1
      RoomType.MINI_BOSS, // 6
    );
    const lockedDoors = normalLookingDoors.filter((door) => door.IsLocked());
    for (const door of lockedDoors) {
      door.TryUnlock(g.p, true); // This has to be forced.
    }
  }
}
