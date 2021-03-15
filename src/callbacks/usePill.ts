import * as misc from "../misc";
import usePillBabyFunctions from "./usePillBabies";

export function main(_pillEffect: PillEffect): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = usePillBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc();
  }
}
