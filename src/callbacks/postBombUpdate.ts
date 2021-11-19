import { getCurrentBaby } from "../util";
import postBombUpdateBabyFunctions from "./postBombUpdateBabies";

export function main(bomb: EntityBomb): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postBombUpdateBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(bomb);
  }
}
