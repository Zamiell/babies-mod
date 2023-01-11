import { EntityType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  removeAllMatchingEntities,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Slippery movement. */
export class DriverBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    // Prevent softlocks from Gaping Maws and cheap damage by Broken Gaping Maws.
    removeAllMatchingEntities(EntityType.GAPING_MAW);
    removeAllMatchingEntities(EntityType.BROKEN_GAPING_MAW);
  }
}
