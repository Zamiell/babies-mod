import {
  CallbackCustom,
  getDoors,
  getPlayersOfType,
  ModCallbackCustom,
} from "isaacscript-common";
import { NORMAL_LOOKING_DOOR_ROOM_TYPES } from "../../constants";
import { g } from "../../globals";
import { pseudoRoomClearPostPEffectUpdateReordered } from "../../pseudoRoomClear";
import { PlayerTypeCustom } from "../../types/PlayerTypeCustom";
import { Baby } from "../Baby";

/** Locked doors in uncleared rooms. */
export class NerdBaby extends Baby {
  /**
   * If the player leaves and re-enters an uncleared room, a normal door will stay locked. So, we
   * need to unlock all normal doors if the room is already clear.
   */
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const roomClear = g.r.IsClear();
    if (!roomClear) {
      return;
    }

    const randomBabies = getPlayersOfType(PlayerTypeCustom.RANDOM_BABY);
    const randomBaby = randomBabies[0];
    if (randomBaby === undefined) {
      return;
    }

    const normalLookingDoors = getDoors(...NORMAL_LOOKING_DOOR_ROOM_TYPES);
    const lockedDoors = normalLookingDoors.filter((door) => door.IsLocked());
    for (const door of lockedDoors) {
      door.TryUnlock(randomBaby, true); // This has to be forced.
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    pseudoRoomClearPostPEffectUpdateReordered(player, this.babyType);
  }
}
