import { getCurrentBaby } from "../util";
import { postBombInitBabyFunctionMap } from "./postBombInitBabyFunctionMap";

export function main(bomb: EntityBomb): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postBombInitBabyFunction = postBombInitBabyFunctionMap.get(babyType);
  if (postBombInitBabyFunction !== undefined) {
    postBombInitBabyFunction(bomb);
  }
}
