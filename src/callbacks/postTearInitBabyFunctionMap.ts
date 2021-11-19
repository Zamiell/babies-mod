export const postTearInitBabyFunctionMap = new Map<
  int,
  (tear: EntityTear) => void
>();

// Lil' Baby
postTearInitBabyFunctionMap.set(36, (tear: EntityTear) => {
  // Everything is tiny
  tear.SpriteScale = Vector(0.5, 0.5);
});

// Big Baby
postTearInitBabyFunctionMap.set(37, (tear: EntityTear) => {
  // Everything is giant
  tear.SpriteScale = Vector(2, 2);
});
