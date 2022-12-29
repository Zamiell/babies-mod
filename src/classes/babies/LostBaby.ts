import { EntityType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
} from "isaacscript-common";
import { postNewRoomReorderedNoHealthUI } from "../../callbacksCustom/postNewRoomReorderedSub";
import { Baby } from "../Baby";

/** Starts with Holy Mantle + Lost-style health. */
export class LostBaby extends Baby {
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.PLAYER)
  private entityTakeDmgPlayer(entity: Entity): boolean | undefined {
    entity.Kill();
    return false;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  private postNewRoomReordered(): void {
    postNewRoomReorderedNoHealthUI();
  }
}
