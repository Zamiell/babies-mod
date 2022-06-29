import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { getCurrentBaby } from "../utils";
import { postPickupCollectBabyFunctionMap } from "./postPickupCollectBabyFunctionMap";

export function init(mod: ModUpgraded): void {
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
