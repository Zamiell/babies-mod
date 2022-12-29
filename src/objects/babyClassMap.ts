import { Baby } from "../classes/Baby";
import { RandomBabyType } from "../enums/RandomBabyType";
import { BABIES } from "./babies";

export const BABY_CLASS_MAP: ReadonlyMap<RandomBabyType, Baby> = (() => {
  const babyClassMap = new Map<RandomBabyType, Baby>();

  for (const [randomBabyTypeString, babyDescription] of Object.entries(
    BABIES,
  )) {
    const randomBabyType = randomBabyTypeString as unknown as RandomBabyType;

    if ("class" in babyDescription) {
      // eslint-disable-next-line new-cap
      const babyClass = new babyDescription.class(
        randomBabyType,
        babyDescription,
      );
      babyClassMap.set(randomBabyType, babyClass);
    }
  }

  return babyClassMap;
})();
