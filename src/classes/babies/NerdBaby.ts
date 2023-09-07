import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";
import {
  pseudoRoomClearPostNewRoomReordered,
  pseudoRoomClearPostPEffectUpdateReordered,
} from "../features/PseudoRoomClear";

/** Locked doors in uncleared rooms. */
export class NerdBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    pseudoRoomClearPostNewRoomReordered();
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    pseudoRoomClearPostPEffectUpdateReordered(player, this.babyType);
  }
}
