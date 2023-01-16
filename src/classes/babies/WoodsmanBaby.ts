import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Meat Cleaver effect on room enter. */
export class WoodsmanBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const roomClear = g.r.IsClear();
    const player = Isaac.GetPlayer();

    if (!roomClear) {
      useActiveItemTemp(player, CollectibleType.MEAT_CLEAVER);
    }
  }
}
