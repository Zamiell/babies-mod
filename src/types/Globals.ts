import { game } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { GlobalsRun } from "./GlobalsRun";

export class Globals {
  // Cache some API classes.
  l = game.GetLevel();
  r = game.GetRoom();
  seeds = game.GetSeeds();
  itemPool = game.GetItemPool();

  /** Per-run variables. */
  run = new GlobalsRun();

  /**
   * A list of the babies that we have chosen so far on this run or multi-character custom
   * challenge.
   */
  pastBabies: RandomBabyType[] = [];

  /** Used for testing specific babies. */
  debugBabyNum: RandomBabyType | undefined;
}
