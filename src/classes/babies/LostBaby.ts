import {
  CallbackCustom,
  isFirstPlayer,
  ModCallbackCustom,
} from "isaacscript-common";
import { postNewRoomReorderedNoHealthUI } from "../../callbacksCustom/postNewRoomReorderedSub";
import { Baby } from "../Baby";

/** Starts with Holy Mantle + Lost-style health. */
export class LostBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    player.Kill();
    return false;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    postNewRoomReorderedNoHealthUI();
  }
}
