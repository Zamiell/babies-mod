import type { RandomBabyType } from "../enums/RandomBabyType";

export class Globals {
  /**
   * A list of the babies that we have chosen so far on this run or multi-character custom
   * challenge.
   */
  pastBabies = new Set<RandomBabyType>();

  /** Used for testing specific babies. */
  debugBabyNum: RandomBabyType | undefined;
}
