import { getCurrentBaby } from "../misc";
import postKnifeInitBabyFunctions from "./postKnifeInitBabies";

export function main(knife: EntityKnife): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postKnifeInitBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(knife);
  }
}
