import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  repeat,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** 3x Keeper's Box effect on room clear. */
export class PegasusBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, true)
  postRoomClearChangedTrue(): void {
    const player = Isaac.GetPlayer();
    const num = this.getAttribute("num");

    repeat(num, () => {
      useActiveItemTemp(player, CollectibleType.KEEPERS_BOX);
    });
  }
}
