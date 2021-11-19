import g from "../globals";
import { getCurrentBaby } from "../util";
import { preGetCollectibleBabyFunctionMap } from "./preGetCollectibleBabyFunctionMap";

export function main(
  _itemPoolType: ItemPoolType,
  _decrease: boolean,
  _seed: int,
): number | void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  // Later on, we might need to call the "itemPool.GetCollectible()" function, which will cause this
  // callback to be re-entered; "babyBool" will be set if this is the case
  if (g.run.babyBool) {
    return undefined;
  }

  const preGetCollectibleBabyFunction =
    preGetCollectibleBabyFunctionMap.get(babyType);
  if (preGetCollectibleBabyFunction !== undefined) {
    return preGetCollectibleBabyFunction();
  }

  return undefined;
}
