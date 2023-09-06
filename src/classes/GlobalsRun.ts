import { getRandomSeed, newRNG, setSeed } from "isaacscript-common";
import type { RandomBabyType } from "../enums/RandomBabyType";

// Per-run variables
export class GlobalsRun {
  // Tracking per run
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
