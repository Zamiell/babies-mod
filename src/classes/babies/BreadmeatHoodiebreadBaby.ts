import { BrokenWatchState, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  onStageOrHigher,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Everything is sped up. */
export class BreadmeatHoodiebreadBaby extends Baby {
  override isValid(): boolean {
    return !onStageOrHigher(LevelStage.WOMB_2);
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const room = game.GetRoom();
    room.SetBrokenWatchState(BrokenWatchState.FAST);
  }
}
