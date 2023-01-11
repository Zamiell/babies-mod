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

/** Coin doors in uncleared rooms. */
export class MouseBaby extends Baby {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    pseudoRoomClearPostUpdate(RandomBabyType.MOUSE);
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const roomClear = g.r.IsClear();

    if (!roomClear) {
      return;
    }

    // Coin doors in uncleared rooms. If the player leaves and re-enters an uncleared room, a normal
    // door will stay locked. So, unlock all normal doors if the room is already clear.
    for (const door of getDoors()) {
      if (door.TargetRoomType === RoomType.DEFAULT && door.IsLocked()) {
        door.TryUnlock(g.p, true); // This has to be forced
      }
    }
  }
}
