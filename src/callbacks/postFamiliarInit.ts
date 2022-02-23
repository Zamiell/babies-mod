import { getCurrentBaby } from "../utils";
import { postFamiliarInitBabyFunctionMap } from "./postFamiliarInitBabyFunctionMap";

export function main(familiar: EntityFamiliar): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postFamiliarInitBabyFunction =
    postFamiliarInitBabyFunctionMap.get(babyType);
  if (postFamiliarInitBabyFunction !== undefined) {
    postFamiliarInitBabyFunction(familiar);
  }
}
