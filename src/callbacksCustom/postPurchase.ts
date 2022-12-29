import { ModCallbackCustom } from "isaacscript-common";
import { mod } from "../mod";
import { getCurrentBaby } from "../utilsBaby";
import { postPickupCollectBabyFunctionMap } from "./postPickupCollectBabyFunctionMap";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PURCHASE, main);
}

function main() {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  // When a player purchases a pickup, it should trigger the same callbacks as when a player
  // collects a pickup from the ground.
  const postPickupCollectBabyFunction =
    postPickupCollectBabyFunctionMap.get(babyType);
  if (postPickupCollectBabyFunction !== undefined) {
    postPickupCollectBabyFunction();
  }
}
