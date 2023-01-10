import { CardType, DoorState, UseFlag } from "isaac-typescript-definitions";
import {
  addFlag,
  CallbackCustom,
  closeDoorFast,
  getDoors,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Create red doors on hit + improved Ultra Secret Rooms. */
export class BloodiedBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const roomClear = g.r.IsClear();

    /** Indexed by target room index. */
    const doorStateMap = new Map<int, DoorState>();

    for (const door of getDoors()) {
      doorStateMap.set(door.TargetRoomIndex, door.State);
    }

    const useFlags = addFlag(UseFlag.NO_ANIMATION, UseFlag.NO_ANNOUNCER_VOICE);
    player.UseCard(CardType.SOUL_CAIN, useFlags);

    if (roomClear) {
      return;
    }

    // Soul of Cain will open all of the doors, but we only want to open the doors to the red rooms.
    for (const door of getDoors()) {
      const oldState = doorStateMap.get(door.TargetRoomIndex);
      if (oldState === undefined) {
        continue;
      }

      if (oldState !== door.State) {
        closeDoorFast(door);
      }
    }

    return undefined;
  }
}
