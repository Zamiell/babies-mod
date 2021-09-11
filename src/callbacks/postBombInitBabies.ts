import { setRandomColor } from "../misc";

const functionMap = new Map<int, (bomb: EntityBomb) => void>();
export default functionMap;

// Lil' Baby
functionMap.set(36, (bomb: EntityBomb) => {
  // Everything is tiny
  bomb.SpriteScale = Vector(0.5, 0.5);
});

// Big Baby
functionMap.set(37, (bomb: EntityBomb) => {
  // Everything is giant
  bomb.SpriteScale = Vector(2, 2);
});

// 404 Baby
functionMap.set(463, (bomb: EntityBomb) => {
  setRandomColor(bomb);
});
