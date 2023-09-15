import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";
import { pseudoRoomClearPostPEffectUpdateReordered } from "../features/PseudoRoomClear";

/** Curse Room doors in uncleared rooms. */
export class BlackBaby extends Baby {
  /**
   * Flight means that they will be able to fly through the Curse Room doors, defeating the purpose
   * of the mechanic.
   */
  override isValid(player: EntityPlayer): boolean {
    return !player.CanFly;
  }

  // Unlike other babies that use the "pseudoRoomClear" feature, we do not need to a
  // `POST_NEW_ROOM_REORDERED` check because Curse Room doors do not need to be unlocked.

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    pseudoRoomClearPostPEffectUpdateReordered(player, this.babyType);
  }
}
