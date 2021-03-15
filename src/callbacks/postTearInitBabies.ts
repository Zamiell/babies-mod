const functionMap = new Map<int, (tear: EntityTear) => void>();
export default functionMap;

// Lil' Baby
functionMap.set(36, (tear: EntityTear) => {
  // Everything is tiny
  tear.SpriteScale = Vector(0.5, 0.5);
});

// Big Baby
functionMap.set(37, (tear: EntityTear) => {
  // Everything is giant
  tear.SpriteScale = Vector(2, 2);
});
