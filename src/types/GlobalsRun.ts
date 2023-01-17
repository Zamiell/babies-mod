import { getRandomSeed, newRNG, setSeed } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";

// Per-run variables
export class GlobalsRun {
  // Tracking per run
  /** Set to true in the `POST_GAME_STARTED` callback. */
  startedRunAsRandomBaby = false;
  babyType: RandomBabyType | null = null;
  drawIntro = false;
  rng = newRNG();

  // Temporary variables
  showIntroFrame = 0;
  showVersionFrame = 0;
  /** Used to make the player temporarily invulnerable. */
  invulnerable = false;
  dealingExtraDamage = false;
  gettingCollectible = false;

  // Baby-specific variables
  /** Initialized to false at the beginning of every floor. */
  babyBool = false;
  /** Initialized to 0 at the beginning of every floor. */
  babyCounters = 0;
  /** Initialized to 0 at the beginning of every floor. */
  babyFrame = 0;
  /** Initialized to null at the beginning of every floor. */
  babySprite: Sprite | null = null;

  constructor(startSeed = getRandomSeed()) {
    setSeed(this.rng, startSeed);
  }
}
