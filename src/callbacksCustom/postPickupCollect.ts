import { getCurrentBaby } from "../util";
import { postPickupCollectBabyFunctionMap } from "./postPickupCollectBabyFunctionMap";

export function main(): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postPickupCollectBabyFunction =
    postPickupCollectBabyFunctionMap.get(babyType);
  if (postPickupCollectBabyFunction !== undefined) {
    postPickupCollectBabyFunction();
  }
}
