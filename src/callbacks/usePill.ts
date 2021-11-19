import { getCurrentBaby } from "../util";
import usePillBabyFunctions from "./usePillBabies";

export function main(_pillEffect: PillEffect): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = usePillBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc();
  }
}
