import { PillColor, PillEffect } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  inStartingRoom,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Constant I'm Excited pill effect. */
export class SillyBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    // Checking for the starting room can prevent crashes when reseeding happens.
    if (!inStartingRoom()) {
      g.p.UsePill(PillEffect.IM_EXCITED, PillColor.NULL);
      // If we try to cancel the animation now, it will bug out the player such that they will not
      // be able to take pocket items or pedestal items. This still happens even if we cancel the
      // animation in the `POST_UPDATE` callback, so don't bother canceling it.
    }
  }
}
