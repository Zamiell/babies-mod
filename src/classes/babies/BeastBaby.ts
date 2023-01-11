import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  inStartingRoom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Random enemies. */
export class BeastBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (!inStartingRoom()) {
      useActiveItemTemp(g.p, CollectibleType.D10);
    }
  }
}
