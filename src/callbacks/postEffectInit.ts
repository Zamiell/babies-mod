import * as misc from "../misc";
import postEffectInitBabyFunctions from "./postEffectInitBabies";

export function main(effect: EntityEffect): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postEffectInitBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(effect);
  }
}
