import { postPickupCollectBabyFunctionMap } from "../postPickupCollectBabyFunctionMap";
import { getCurrentBaby } from "../util";

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
