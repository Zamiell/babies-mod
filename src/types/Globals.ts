import { game, getRandomSeed } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { GlobalsRun } from "./GlobalsRun";

export class Globals {
  babiesMod: Mod | null = null;

  // Cache some API classes.
  l = game.GetLevel();
  r = game.GetRoom();
  seeds = game.GetSeeds();
  itemPool = game.GetItemPool();

  /** Per-run variables. */
  // RNG variables are temporarily initialized with a random seed while in the menu. (They are
  // normally initialized with the run's start seed.)
  run = new GlobalsRun(getRandomSeed());

  /**
   * A list of the babies that we have chosen so far on this run or multi-character custom
   * challenge.
   */
  pastBabies: RandomBabyType[] = [];

  /** Used for testing specific babies. */
  debugBabyNum: RandomBabyType | undefined;
}
