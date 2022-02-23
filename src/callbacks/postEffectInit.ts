import { getCurrentBaby } from "../utils";
import { postEffectInitBabyFunctionMap } from "./postEffectInitBabyFunctionMap";

export function main(effect: EntityEffect): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postEffectInitBabyFunction =
    postEffectInitBabyFunctionMap.get(babyType);
  if (postEffectInitBabyFunction !== undefined) {
    postEffectInitBabyFunction(effect);
  }
}
