import { ModCallbackCustom } from "isaacscript-common";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";
import { postPickupCollectBabyFunctionMap } from "./postPickupCollectBabyFunctionMap";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT, main);
}

function main() {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postPickupCollectBabyFunction =
    postPickupCollectBabyFunctionMap.get(babyType);
  if (postPickupCollectBabyFunction !== undefined) {
    postPickupCollectBabyFunction();
  }
}
