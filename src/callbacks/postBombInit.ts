import { getCurrentBaby } from "../util";
import postBombInitBabyFunctions from "./postBombInitBabies";

export function main(bomb: EntityBomb): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postBombInitBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(bomb);
  }
}
