import { setEntityRandomColor } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";

export const postBombInitBabyFunctionMap = new Map<
  RandomBabyType,
  (bomb: EntityBomb) => void
>();

// 42
postBombInitBabyFunctionMap.set(RandomBabyType.COLORFUL, (bomb: EntityBomb) => {
  setEntityRandomColor(bomb);
});
