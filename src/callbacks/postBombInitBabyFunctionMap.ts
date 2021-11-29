import { setEntityRandomColor } from "isaacscript-common";

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

// Colorful Baby
postBombInitBabyFunctionMap.set(42, (bomb: EntityBomb) => {
  setEntityRandomColor(bomb);
});
