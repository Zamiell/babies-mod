import { getCurrentBaby } from "../utils";
import { postEffectUpdateBabyFunctionMap } from "./postEffectUpdateBabyFunctionMap";

export function main(effect: EntityEffect): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postEffectUpdateBabyFunction =
    postEffectUpdateBabyFunctionMap.get(babyType);
  if (postEffectUpdateBabyFunction !== undefined) {
    postEffectUpdateBabyFunction(effect);
  }
}
