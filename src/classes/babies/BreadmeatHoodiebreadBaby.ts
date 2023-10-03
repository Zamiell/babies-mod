import { BrokenWatchState } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom, game } from "isaacscript-common";
import { Baby } from "../Baby";

/** Everything is sped up. */
export class BreadmeatHoodiebreadBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const room = game.GetRoom();
    room.SetBrokenWatchState(BrokenWatchState.FAST);
  }
}
