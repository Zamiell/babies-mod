import { getCurrentBaby } from "../util";
import postEffectUpdateBabyFunctions from "./postEffectUpdateBabies";

export function main(effect: EntityEffect): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postEffectUpdateBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(effect);
  }
}
