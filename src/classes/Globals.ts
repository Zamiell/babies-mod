import type { RandomBabyType } from "../enums/RandomBabyType";
import { GlobalsRun } from "./GlobalsRun";

export class Globals {
  /** Per-run variables. */
  run = new GlobalsRun();

  /**
   * A list of the babies that we have chosen so far on this run or multi-character custom
   * challenge.
   */
  pastBabies = new Set<RandomBabyType>();

  /** Used for testing specific babies. */
  debugBabyNum: RandomBabyType | undefined;
}
