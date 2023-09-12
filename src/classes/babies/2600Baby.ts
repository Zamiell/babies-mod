import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Friend Finder effect on room clear. */
export class N2600Baby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, true)
  postRoomClearChangedTrue(): boolean | undefined {
    const player = Isaac.GetPlayer();
    useActiveItemTemp(player, CollectibleType.FRIEND_FINDER);
    return undefined;
  }
}
