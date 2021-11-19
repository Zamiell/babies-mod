import { getCurrentBaby } from "../util";
import { postFamiliarUpdateBabyFunctionMap } from "./postFamiliarUpdateBabyFunctionMap";

export function main(familiar: EntityFamiliar): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postFamiliarUpdateBabyFunction =
    postFamiliarUpdateBabyFunctionMap.get(babyType);
  if (postFamiliarUpdateBabyFunction !== undefined) {
    postFamiliarUpdateBabyFunction(familiar);
  }
}
