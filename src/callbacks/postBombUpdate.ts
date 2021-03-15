import * as misc from "../misc";
import postBombUpdateBabyFunctions from "./postBombUpdateBabies";

export function main(bomb: EntityBomb): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postBombUpdateBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(bomb);
  }
}
