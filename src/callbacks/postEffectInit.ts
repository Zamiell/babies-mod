import { getCurrentBaby } from "../util";
import postEffectInitBabyFunctions from "./postEffectInitBabies";

export function main(effect: EntityEffect): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postEffectInitBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(effect);
  }
}
