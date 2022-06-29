import { setEntityRandomColor } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";

export const postBombInitBabyFunctionMap = new Map<
  RandomBabyType,
  (bomb: EntityBomb) => void
>();

// 36
postBombInitBabyFunctionMap.set(RandomBabyType.LIL, (bomb: EntityBomb) => {
  // Everything is tiny.
  bomb.SpriteScale = Vector(0.5, 0.5);
});

// 37
postBombInitBabyFunctionMap.set(RandomBabyType.BIG, (bomb: EntityBomb) => {
  // Everything is giant.
  bomb.SpriteScale = Vector(2, 2);
});

// 42
postBombInitBabyFunctionMap.set(RandomBabyType.COLORFUL, (bomb: EntityBomb) => {
  setEntityRandomColor(bomb);
});
