import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  inStartingRoom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Random enemies. */
export class BeastBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const player = Isaac.GetPlayer();

    if (!inStartingRoom()) {
      useActiveItemTemp(player, CollectibleType.D10);
    }
  }
}
