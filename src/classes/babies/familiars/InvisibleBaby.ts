import {
  CallbackCustom,
  ModCallbackCustom,
  onRoomFrame,
} from "isaacscript-common";
import { Baby } from "../../Baby";

/** Invisibility. */
export class InvisibleBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    if (onRoomFrame(1)) {
      // The sprite is a blank PNG, but we also want to remove the shadow. Doing this in the
      // `POST_NEW_ROOM` callback won't work. Doing this on frame 0 won't work.
      player.Visible = false;
    }
  }
}
