import { game } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { GlobalsRun } from "./GlobalsRun";

export class Globals {
  babiesMod: Mod | null = null;

  // Cache some API classes.
  l = game.GetLevel();
  r = game.GetRoom();
  seeds = game.GetSeeds();
  itemPool = game.GetItemPool();

  /**
   * "Isaac.GetPlayer()" will return nil if called from the main menu. We "lie" and say that it gets
   * set to an `EntityPlayer` so that we don't have to do non-null assertions everywhere. In
   * reality, the value will be set in the `POST_PLAYER_INIT` callback, which will happen before any
   * other code gets run.
   */
  p = Isaac.GetPlayer();

  font = {
    droid: Font(),
  };

  /** Per-run variables. */
  run = new GlobalsRun();

  /**
   * A list of the babies that we have chosen so far on this run or multi-character custom
   * challenge.
   */
  pastBabies: RandomBabyType[] = [];

  /** Used for testing specific babies. */
  debugBabyNum: RandomBabyType | undefined;

  constructor() {
    this.font.droid.Load("font/droid.fnt");
  }
}
