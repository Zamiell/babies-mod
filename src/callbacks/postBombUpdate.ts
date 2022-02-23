import { getCurrentBaby } from "../utils";
import { postBombUpdateBabyFunctionMap } from "./postBombUpdateBabyFunctionMap";

export function main(bomb: EntityBomb): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postBombUpdateBabyFunction =
    postBombUpdateBabyFunctionMap.get(babyType);
  if (postBombUpdateBabyFunction !== undefined) {
    postBombUpdateBabyFunction(bomb);
  }
}
