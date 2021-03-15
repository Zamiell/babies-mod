import * as misc from "../misc";
import postBombInitBabyFunctions from "./postBombInitBabies";

export function main(bomb: EntityBomb): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postBombInitBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(bomb);
  }
}
