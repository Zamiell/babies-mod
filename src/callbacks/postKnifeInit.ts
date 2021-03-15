import * as misc from "../misc";
import postKnifeInitBabyFunctions from "./postKnifeInitBabies";

export function main(knife: EntityKnife): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postKnifeInitBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(knife);
  }
}
