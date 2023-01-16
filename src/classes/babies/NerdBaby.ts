import {
  CallbackCustom,
  getDoors,
  ModCallbackCustom,
} from "isaacscript-common";
import { NORMAL_LOOKING_DOOR_ROOM_TYPES } from "../../constants";
import { g } from "../../globals";
import { pseudoRoomClearPostPEffectUpdateReordered } from "../../pseudoRoomClear";
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

    // We don't want to filter for `PlayerTypeCustom.RANDOM_BABY` because the player could be e.g.
    // Dark Judas.
    const player = Isaac.GetPlayer();

    const normalLookingDoors = getDoors(...NORMAL_LOOKING_DOOR_ROOM_TYPES);
    const lockedDoors = normalLookingDoors.filter((door) => door.IsLocked());
    for (const door of lockedDoors) {
      door.TryUnlock(player, true); // This has to be forced.
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    pseudoRoomClearPostPEffectUpdateReordered(player, this.babyType);
  }
}
