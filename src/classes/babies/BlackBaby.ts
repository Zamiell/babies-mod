import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";
import { pseudoRoomClearPostPEffectUpdateReordered } from "../features/PseudoRoomClear";

/** Curse Room doors in uncleared rooms. */
export class BlackBaby extends Baby {
  // We do not need to a `POST_NEW_ROOM_REORDERED` check because Curse Room doors do not need to be
  // unlocked.

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    pseudoRoomClearPostPEffectUpdateReordered(player, this.babyType);
  }
}
