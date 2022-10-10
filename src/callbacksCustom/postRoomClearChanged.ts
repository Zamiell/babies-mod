import { ModCallbackCustom } from "isaacscript-common";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";
import { postRoomClearChangedBabyFunctionMap } from "./postRoomClearChangedBabyFunctionMap";

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_ROOM_CLEAR_CHANGED,
    roomCleared,
    true,
  );
}

function roomCleared() {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postRoomClearChangedBabyFunction =
    postRoomClearChangedBabyFunctionMap.get(babyType);
  if (postRoomClearChangedBabyFunction !== undefined) {
    postRoomClearChangedBabyFunction();
  }
}
