import { getCurrentBaby } from "../utils";
import { postKnifeInitBabyFunctionMap } from "./postKnifeInitBabyFunctionMap";

export function main(knife: EntityKnife): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postKnifeInitBabyFunction = postKnifeInitBabyFunctionMap.get(babyType);
  if (postKnifeInitBabyFunction !== undefined) {
    postKnifeInitBabyFunction(knife);
  }
}
