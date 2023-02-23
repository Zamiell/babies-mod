import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Meat Cleaver effect on room enter. */
export class WoodsmanBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const room = game.GetRoom();
    const roomClear = room.IsClear();
    const player = Isaac.GetPlayer();

    if (!roomClear) {
      useActiveItemTemp(player, CollectibleType.MEAT_CLEAVER);
    }
  }
}
