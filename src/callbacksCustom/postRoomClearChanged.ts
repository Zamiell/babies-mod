import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { getCurrentBaby } from "../utils";
import { postRoomClearChangedBabyFunctionMap } from "./postRoomClearChangedBabyFunctionMap";

export function init(mod: ModUpgraded): void {
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
