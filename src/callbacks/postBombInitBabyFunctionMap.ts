import { setRandomColor } from "../util";

export const postBombInitBabyFunctionMap = new Map<
  int,
  (bomb: EntityBomb) => void
>();

// Lil' Baby
postBombInitBabyFunctionMap.set(36, (bomb: EntityBomb) => {
  // Everything is tiny
  bomb.SpriteScale = Vector(0.5, 0.5);
});

// Big Baby
postBombInitBabyFunctionMap.set(37, (bomb: EntityBomb) => {
  // Everything is giant
  bomb.SpriteScale = Vector(2, 2);
});

// 404 Baby
postBombInitBabyFunctionMap.set(463, (bomb: EntityBomb) => {
  setRandomColor(bomb);
});
