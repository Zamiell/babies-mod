import { ModCallback } from "isaac-typescript-definitions";
import { mod } from "../mod";
import { getCurrentBaby } from "../utilsBaby";
import { preSpawnClearAwardBabyFunctionMap } from "./preSpawnClearAwardBabyFunctionMap";

export function init(): void {
  mod.AddCallback(ModCallback.PRE_SPAWN_CLEAR_AWARD, main);
}

/** This is used over the `POST_ROOM_CLEAR_CHANGED` callback since it happens a frame sooner. */
function main(): boolean | undefined {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postRoomClearChangedBabyFunction =
    preSpawnClearAwardBabyFunctionMap.get(babyType);
  if (postRoomClearChangedBabyFunction !== undefined) {
    postRoomClearChangedBabyFunction();
  }

  return undefined;
}
