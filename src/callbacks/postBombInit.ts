import { getCurrentBaby } from "../misc";
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
