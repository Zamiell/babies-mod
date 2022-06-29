import { RandomBabyType } from "../enums/RandomBabyType";

export const postTearInitBabyFunctionMap = new Map<
  RandomBabyType,
  (tear: EntityTear) => void
>();

// 36
postTearInitBabyFunctionMap.set(RandomBabyType.LIL, (tear: EntityTear) => {
  // Everything is tiny
  tear.SpriteScale = Vector(0.5, 0.5);
});

// 37
postTearInitBabyFunctionMap.set(RandomBabyType.BIG, (tear: EntityTear) => {
  // Everything is giant
  tear.SpriteScale = Vector(2, 2);
});
