import { BrokenWatchState, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getEffectiveStage,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Everything is sped up. */
export class BreadmeatHoodiebreadBaby extends Baby {
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage < LevelStage.WOMB_2;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    g.r.SetBrokenWatchState(BrokenWatchState.FAST);
  }
}
