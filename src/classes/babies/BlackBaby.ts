import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { pseudoRoomClearPostPEffectUpdateReordered } from "../../pseudoRoomClear";
import { Baby } from "../Baby";

/** Curse Room doors in uncleared rooms. */
export class BlackBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    pseudoRoomClearPostPEffectUpdateReordered(player, this.babyType);
  }
}
