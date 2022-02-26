import { getCurrentBaby } from "../utils";
import { postGridEntityUpdateBabyFunctionMap } from "./postGridEntityUpdateBabyFunctionMap";

export function main(gridEntity: GridEntity): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postGridEntityUpdateBabyFunction =
    postGridEntityUpdateBabyFunctionMap.get(babyType);
  if (postGridEntityUpdateBabyFunction !== undefined) {
    postGridEntityUpdateBabyFunction(gridEntity);
  }
}
